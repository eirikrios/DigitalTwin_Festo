import mysql.connector
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
from urllib.parse import unquote_plus
from config import USUARIO, SENHA, SERVIDOR, DATABASE

DB_CONFIG = {
    "host": SERVIDOR,
    "user": USUARIO,
    "password": unquote_plus(str(SENHA)),
    "database": DATABASE,
}

app = Flask(__name__)
CORS(app)

def get_conn():
    """Conexão simples com MySQL."""
    return mysql.connector.connect(**DB_CONFIG)

@app.route("/api/opcua/readings", methods=["POST"])
def ingest_readings():
    """
    Espera JSON:
    {
      "readings":[
        {"tag":"Avancado_1S2","value":1,"ts":"2025-02-09T19:48:31Z"},
        {"tag":"PressaoEntradaDSBC","value":6.8,"ts":"2025-02-09T19:48:31Z"}
      ]
    }
    Salva em `leiturasinal` (colunas: tag, node_id, valor_bool, valor_num, ts_coleta, origem, ts_ins).
    """
    data = request.get_json(silent=True) or {}
    readings = data.get("readings", [])
    if not readings:
        return jsonify({"ok": False, "error": "payload vazio"}), 400

    rows = []
    now = datetime.now()

    for r in readings:
        tag = str(r.get("tag") or "").strip()
        ts = r.get("ts")
        if not tag or ts is None:
            return jsonify({"ok": False, "error": f"linha inválida: {r}"}), 400

        try:
            ts_coleta = datetime.fromisoformat(str(ts).replace("Z", "+00:00")).replace(tzinfo=None)
        except Exception:
            ts_coleta = now

        raw = r.get("value")

        v_bool = 1 if str(raw).lower() in ("1", "true", "t", "on") or raw is True else 0
        try:
            v_num = float(raw)
        except (TypeError, ValueError):
            v_num = None

        rows.append((tag, None, v_bool, v_num, ts_coleta, "node-red"))

    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.executemany(
            """
            INSERT INTO leiturasinal
              (tag, node_id, valor_bool, valor_num, ts_coleta, origem, ts_ins)
            VALUES
              (%s,  %s,      %s,         %s,        %s,        %s,     NOW())
            """,
            rows,
        )
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"ok": True, "ingest_count": len(rows)}), 200
    except mysql.connector.Error as err:
        return jsonify({"ok": False, "error": str(err)}), 500


def _latest_numeric_by_tag(cur, tag: str):
    cur.execute(
        """
        SELECT valor_num
          FROM leiturasinal
         WHERE tag=%s AND valor_num IS NOT NULL
         ORDER BY ts_ins DESC
         LIMIT 1
        """,
        (tag,),
    )
    row = cur.fetchone()
    return None if not row else row[0]


def _latest_bool_by_tag(cur, tag: str):
    cur.execute(
        """
        SELECT valor_bool
          FROM leiturasinal
         WHERE tag=%s
         ORDER BY ts_ins DESC
         LIMIT 1
        """,
        (tag,),
    )
    row = cur.fetchone()
    return None if not row else int(row[0])


@app.route("/api/cylinder/status", methods=["GET"])
def cylinder_status():
    """
    Retorna status legível dos dois cilindros (DSNU e DSBC) com base nos últimos sinais.
    Usa tags:
      DSNU: Avancado_1S2 / Recuado_1S1
      DSBC: Avancado_2S2 / Recuado_2S1
    """
    try:
        conn = get_conn()
        cur = conn.cursor()

        # DSNU
        dsnu_av = _latest_bool_by_tag(cur, "Avancado_1S2") or 0
        dsnu_re = _latest_bool_by_tag(cur, "Recuado_1S1") or 0
        if dsnu_av == 1 and dsnu_re == 0:
            status_dsnu = "AVANÇADO"
        elif dsnu_re == 1 and dsnu_av == 0:
            status_dsnu = "RECUADO"
        else:
            status_dsnu = "POSIÇÃO INDEFINIDA"

        # DSBC
        dsbc_av = _latest_bool_by_tag(cur, "Avancado_2S2") or 0
        dsbc_re = _latest_bool_by_tag(cur, "Recuado_2S1") or 0
        if dsbc_av == 1 and dsbc_re == 0:
            status_dsbc = "AVANÇADO"
        elif dsbc_re == 1 and dsbc_av == 0:
            status_dsbc = "RECUADO"
        else:
            status_dsbc = "POSIÇÃO INDEFINIDA"

        cur.close()
        conn.close()

        return jsonify(
            {
                "statusCilindro1": status_dsnu,
                "statusCilindro2": status_dsbc,
            }
        ), 200
    except mysql.connector.Error as err:
        return jsonify({"ok": False, "error": str(err)}), 500


@app.route("/api/cylinder/history", methods=["GET"])
def cylinder_history():
    """
    ?tag=Avancado_1S2 (ou qualquer outra tag)
    Retorna últimos 200 pontos (ts, valor) em ordem crescente de tempo.
    Para tags booleanas usa valor_bool; para numéricas, valor_num.
    """
    tag = request.args.get("tag", "").strip()
    if not tag:
        return jsonify({"error": "Tag é necessária"}), 400

    try:
        conn = get_conn()
        cur = conn.cursor(dictionary=True)

        cur.execute(
            """
            SELECT valor_num, valor_bool
              FROM leiturasinal
             WHERE tag=%s
             ORDER BY ts_ins DESC
             LIMIT 1
            """,
            (tag,),
        )
        last = cur.fetchone()
        if not last:
            cur.close()
            conn.close()
            return jsonify([]), 200

        is_numeric = last["valor_num"] is not None

        if is_numeric:
            cur.execute(
                """
                SELECT ts_ins AS ts, valor_num AS valor
                  FROM leiturasinal
                 WHERE tag=%s AND valor_num IS NOT NULL
                 ORDER BY ts_ins DESC
                 LIMIT 200
                """,
                (tag,),
            )
        else:
            cur.execute(
                """
                SELECT ts_ins AS ts, valor_bool AS valor
                  FROM leiturasinal
                 WHERE tag=%s
                 ORDER BY ts_ins DESC
                 LIMIT 200
                """,
                (tag,),
            )

        rows = cur.fetchall()
        rows = rows[::-1]

        for r in rows:
            if isinstance(r["ts"], datetime):
                r["ts"] = r["ts"].isoformat()

        cur.close()
        conn.close()
        return jsonify(rows), 200
    except mysql.connector.Error as err:
        return jsonify({"ok": False, "error": str(err)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)