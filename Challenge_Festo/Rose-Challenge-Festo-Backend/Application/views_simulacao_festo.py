import sys
import pathlib
from datetime import datetime
from urllib.parse import unquote_plus
from typing import Any, Dict, List, Optional

from flask import Blueprint, request, jsonify, Flask
from flask_cors import CORS

if __package__ in (None, ""):
    _root = pathlib.Path(__file__).resolve().parents[1]
    if str(_root) not in sys.path:
        sys.path.insert(0, str(_root))

from Application.extensions import db
from Application.models import LeituraSinal

bp_simulacao = Blueprint("simulacao", __name__)

def _parse_iso_ts(value: Any) -> datetime:
    """
    Aceita '2025-10-20T15:06:00Z' ou ISO local sem Z.
    Em caso de erro, retorna datetime.now() (sem timezone).
    """
    if value is None:
        return datetime.now()
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00")).replace(tzinfo=None)
    except Exception:
        return datetime.now()


def _coerce_bool(v: Any) -> int:
    return 1 if (str(v).lower() in ("1", "true", "t", "on") or v is True) else 0


def _coerce_float(v: Any) -> Optional[float]:
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


@bp_simulacao.route("/api/opcua/readings", methods=["POST"], endpoint="opcua_readings_ingest")
def opcua_readings():
    """
    Formatos aceitos:
      1) {"readings":[{"tag":"Avancado_1S2","value":1,"ts":"2025-10-20T15:06:00Z"}, ...]}
      2) [{"tag":"Avancado_1S2","value":1,"ts":"2025-10-20T15:06:00Z"}, ...]   (lista no topo)
    Também aceita 'ts_coleta' como alternativa a 'ts'.
    Grava em LeituraSinal com valor_bool e valor_num.
    """
    data = request.get_json(silent=True)

    if isinstance(data, list):
        readings = data
    else:
        data = data or {}
        readings = data.get("readings", [])

    if not readings:
        return jsonify({"ok": False, "error": "payload vazio"}), 400

    objs: List[LeituraSinal] = []
    for r in readings:
        tag = (r.get("tag") or "").strip()
        node_id = r.get("node_id")
        ts = r.get("ts", r.get("ts_coleta"))
        value = r.get("value")

        if not tag or ts is None:
            return jsonify({"ok": False, "error": f"linha inválida: {r}"}), 400

        ts_coleta = _parse_iso_ts(ts)
        valor_bool = _coerce_bool(value)
        valor_num = _coerce_float(value)

        objs.append(
            LeituraSinal(
                tag=tag,
                node_id=node_id,
                valor_bool=valor_bool,
                valor_num=valor_num,
                ts_coleta=ts_coleta,
                origem="node-red",
            )
        )

    try:
        session = db.session
        session.bulk_save_objects(objs)
        session.commit()
        return jsonify({"ok": True, "ingest_count": len(objs)}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"ok": False, "error": str(e)}), 500


@bp_simulacao.get("/api/cylinder/status")
def cylinder_status():
    """
    Retorna status legível dos dois cilindros (DSNU e DSBC) com base nos últimos sinais.
    Usa tags:
      DSNU: Avancado_1S2 / Recuado_1S1
      DSBC: Avancado_2S2 / Recuado_2S1
    """
    def _latest_bool_by_tag(tag: str) -> Optional[int]:
        row = (
            db.session.query(LeituraSinal.valor_bool)
            .filter(LeituraSinal.tag == tag)
            .order_by(LeituraSinal.ts_ins.desc())
            .limit(1)
            .one_or_none()
        )
        if not row:
            return None
        v = row[0]
        return None if v is None else int(v)

    try:
        dsnu_av = _latest_bool_by_tag("Avancado_1S2") or 0
        dsnu_re = _latest_bool_by_tag("Recuado_1S1") or 0
        if dsnu_av == 1 and dsnu_re == 0:
            status_dsnu = "AVANÇADO"
        elif dsnu_re == 1 and dsnu_av == 0:
            status_dsnu = "RECUADO"
        else:
            status_dsnu = "POSIÇÃO INDEFINIDA"

        dsbc_av = _latest_bool_by_tag("Avancado_2S2") or 0
        dsbc_re = _latest_bool_by_tag("Recuado_2S1") or 0
        if dsbc_av == 1 and dsbc_re == 0:
            status_dsbc = "AVANÇADO"
        elif dsbc_re == 1 and dsbc_av == 0:
            status_dsbc = "RECUADO"
        else:
            status_dsbc = "POSIÇÃO INDEFINIDA"

        return jsonify({"statusCilindro1": status_dsnu, "statusCilindro2": status_dsbc}), 200
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500


@bp_simulacao.get("/api/cylinder/history")
def cylinder_history():
    """
    ?tag=Avancado_1S2 (ou qualquer outra tag)
    Retorna últimos 200 pontos (ts, valor) em ordem crescente de tempo.
    Para tags booleanas usa valor_bool; para numéricas, valor_num.
    """
    tag = (request.args.get("tag") or "").strip()
    if not tag:
        return jsonify({"error": "Tag é necessária"}), 400

    try:
        last = (
            db.session.query(LeituraSinal.valor_num, LeituraSinal.valor_bool)
            .filter(LeituraSinal.tag == tag)
            .order_by(LeituraSinal.ts_ins.desc())
            .limit(1)
            .one_or_none()
        )
        if not last:
            return jsonify([]), 200

        is_numeric = last[0] is not None

        if is_numeric:
            rows = (
                db.session.query(LeituraSinal.ts_ins, LeituraSinal.valor_num)
                .filter(LeituraSinal.tag == tag, LeituraSinal.valor_num.isnot(None))
                .order_by(LeituraSinal.ts_ins.desc())
                .limit(200)
                .all()
            )
        else:
            rows = (
                db.session.query(LeituraSinal.ts_ins, LeituraSinal.valor_bool)
                .filter(LeituraSinal.tag == tag)
                .order_by(LeituraSinal.ts_ins.desc())
                .limit(200)
                .all()
            )

        rows = rows[::-1]
        out: List[Dict[str, Any]] = []
        for ts_ins, valor in rows:
            ts_str = ts_ins.isoformat() if isinstance(ts_ins, datetime) else str(ts_ins)
            out.append({"ts": ts_str, "valor": valor})

        return jsonify(out), 200
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500
    

if __name__ == "__main__":
    app = Flask(__name__)

    CORS(app)

    app.config.from_object("Application.config")

    db.init_app(app)

    app.register_blueprint(bp_simulacao)

    print("== ROTAS CARREGADAS ==")
    with app.app_context():
        for r in app.url_map.iter_rules():
            print(r)

    app.run(debug=True, host="0.0.0.0", port=5000)
