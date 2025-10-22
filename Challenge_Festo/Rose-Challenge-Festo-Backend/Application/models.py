from datetime import datetime
from sqlalchemy.sql import func
from Application.extensions import db

class HistoricoEquipamento(db.Model):
    __tablename__ = 'historicoequipamento'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pressaoEntrada = db.Column(db.Float)
    pressaoSaida = db.Column(db.Float)
    temperaturaAmbiente = db.Column(db.Float)
    umidadeInterna = db.Column(db.Float)
    vibracao = db.Column(db.Float)
    posicaoPistao = db.Column(db.Float)
    tempoCiclo = db.Column(db.Float)
    result = db.Column(db.String(255), nullable=False)
    criacao = db.Column(db.DateTime, default=datetime.utcnow)

class LeituraSinal(db.Model):
    __tablename__ = "LeituraSinal"

    id         = db.Column(db.Integer, primary_key=True)
    tag        = db.Column(db.String(128), nullable=False, index=True)
    node_id    = db.Column(db.String(512))
    valor_bool = db.Column(db.Boolean, nullable=False)
    valor_num  = db.Column(db.Float, nullable=True)           # ← adicionado
    ts_coleta  = db.Column(db.DateTime, nullable=False)
    origem     = db.Column(db.String(64), default="node-red")
    ts_ins     = db.Column(                                   # ← adicionado
        db.DateTime,
        nullable=False,
        server_default=db.func.now(),
        index=True
    )

    def __repr__(self) -> str:
        return f"<LeituraSinal id={self.id} tag={self.tag} bool={self.valor_bool} num={self.valor_num}>"