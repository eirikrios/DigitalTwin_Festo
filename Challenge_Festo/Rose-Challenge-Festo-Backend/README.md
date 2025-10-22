# Backend — API Flask + MySQL

API REST para ingestão, consulta e análise de leituras do sistema pneumático FESTO.

---

## Stack & Requisitos

- Python 3.11+
- Flask (+ extensões: CORS, SQLAlchemy, etc.)
- MySQL 8+
- Arquivo `.env` para credenciais e configuração do app

---

## Setup

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

pip install -r requirements.txt
```

Crie um arquivo **`.env`** em `backend/` (exemplo):

```env
# Banco de dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=__defina_sua_senha__
DB_NAME=festochallenge

# Flask
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_RUN_HOST=0.0.0.0
FLASK_RUN_PORT=5000

# CORS (se necessário)
CORS_ORIGINS=http://localhost:19006,http://localhost:3000
```

## 🗄️ Banco & Migração

Criação/atualização do schema (opcional):
```bash
python Application/prepare_database.py
```

Teste de conexão (opcional):
```bash
python Application/test_connection.py
```

---

## ▶️ Executar

```bash
# Opção A
python Application/app.py

# Opção B (se tiver flask cli configurado)
flask --app Application/app.py run
```

Servidor padrão: `http://127.0.0.1:5000/`

---

## 🔌 Endpoints (exemplos)

> Ajuste a lista com base nas rotas existentes.

| Método | Rota                                             | Descrição                                 |
|-------:|--------------------------------------------------|-------------------------------------------|
| GET    | `/api/cylinder/status`                           | Status atual do cilindro                  |
| GET    | `/api/cylinder/history?tag=Avancado_1S2`         | Histórico de uma tag específica           |
| GET    | `/api/cylinder/history?tag=Recuado_1S1`          | Histórico da tag de recuo                 |
| GET    | `/api/cylinder/metrics?window=30m` *(se houver)* | Métricas agregadas por janela de tempo    |

Testes rápidos:
```bash
curl -i "http://127.0.0.1:5000/api/cylinder/status"
curl -i "http://127.0.0.1:5000/api/cylinder/history?tag=Avancado_1S2"
```

---

## 🧱 Estrutura

```text
backend/
├─ Application/
│  ├─ app.py                   # entrypoint do Flask
│  ├─ config.py                # configurações (DB, Flask, etc.)
│  ├─ extensions.py            # inicialização de extensões
│  ├─ models.py                # ORM: tabelas/entidades
│  ├─ views_logic_festo.py     # rotas + regras de negócio
│  ├─ views_simulacao_festo.py # rotas de simulação
│  ├─ prepare_database.py      # criação/atualização de schema
│  ├─ test_connection.py       # sanity check de conexão
│  └─ __init__.py
├─ requirements.txt
└─ README.md
```