# Festo Digital Twin — Monitoramento & Análise de Atuador Pneumático

Plataforma de **monitoramento**, **análise** e **relatórios** para um sistema pneumático FESTO, composta por:
- **Node-RED** — aquisição e simulação de dados dos sensores/atuadores.
- **Backend (Flask + MySQL)** — ingestão, APIs REST e persistência.
- **Frontend (React + Expo)** — visualização de status, histórico e métricas.

---

## Estrutura do Repositório

```text
/
├─ Rose_Flow.json                 # fluxo Node-RED (simulador e envio ao backend)
├─ Rose-Challenge-Festo/          # frontend (React + Expo)
├─ Rose-Challenge-Festo-Backend/  # backend (Flask + MySQL)
└─ README.md                      # este arquivo
```

## Fluxo de Dados (Visão Geral)

```text
╔════════════════╗       ╔════════════════╗       ╔═══════════════╗       ╔════════════════╗
║    Node-RED    ║ ───▶  ║  Flask API     ║ ───▶  ║   MySQL DB    ║ ───▶  ║  React (Expo)  ║
║  (Simulação)   ║       ║  (/api/...)    ║       ║  Leituras     ║       ║  Dashboard     ║
╚════════════════╝       ╚════════════════╝       ╚═══════════════╝       ╚════════════════╝
       │
       └── Recebe parâmetros (pressão/carga) via `/sim/input`
```

---

## Execução Rápida (Desenvolvimento)

**Pré-requisitos:** Python 3.11+, Node.js 18+, npm/yarn, MySQL 8+, Node-RED 3.x+

### 1️⃣ Node-RED — Simulador de Sensores

1. Abra o Node-RED (`http://127.0.0.1:1880`).
2. Importe o arquivo `Rose_Flow.json` via **Menu → Import → Upload**.
3. Clique em **Deploy**.
4. O fluxo executará automaticamente, enviando leituras via HTTP para o backend Flask.

#### Endpoints Node-RED
| Tipo | Rota | Função |
|------|------|--------|
| POST | `/sim/input` | Recebe parâmetros de simulação (pressão/carga) para DSNU e DSBC. |
| POST | (interno) → `http://127.0.0.1:5000/api/opcua/readings` | Envia as leituras geradas para o backend Flask. |

#### Tags Geradas (Simulação)
- **DSNU (cilindro 1)** → `Avancado_1S2`, `Recuado_1S1`, `PressaoEntradaDSNU`, `PressaoSaidaDSNU`
- **DSBC (cilindro 2)** → `Avancado_2S2`, `Recuado_2S1`, `PressaoEntradaDSBC`, `PressaoSaidaDSBC`

---

### 2️⃣ Backend — API Flask + MySQL

```bash
cd Rose-Challenge-Festo-Backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate

pip install -r requirements.txt
python Application/prepare_database.py   # opcional
python Application/app.py
```
> Acesse em: `http://127.0.0.1:5000`  
> Mais detalhes em [`backend/README.md`](Rose-Challenge-Festo-Backend/README.md)

---

### 3️⃣ Frontend — React (Expo)

```bash
cd Rose-Challenge-Festo
npm install
npm start
```
> Acesse no Expo Go (mobile) ou navegador (modo web).  
> Mais detalhes em [`frontend/README.md`](Rose-Challenge-Festo/README.md)

---

## Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-------------|
| Aquisição | Node-RED (simulação OPC-UA / HTTP) |
| Backend | Python, Flask, SQLAlchemy, MySQL |
| Frontend | React (Expo), Recharts, Fetch/Axios |
| Infraestrutura | `.env`, CORS, integração REST |
| Outras | PlantUML (diagramas), JSON APIs |

---

## Testes Rápidos

### Backend
```bash
curl -i "http://127.0.0.1:5000/api/cylinder/status"
curl -i "http://127.0.0.1:5000/api/cylinder/history?tag=Avancado_1S2"
```

### Node-RED (ajuste parâmetros via POST)
```bash
curl -X POST http://127.0.0.1:1880/sim/input \
  -H "Content-Type: application/json" \
  -d '{"dsnu": {"pressao": 6, "carga": 120}, "dsbc": {"pressao": 8, "carga": 250}}'
```

---

## Contribuidores

- André Victor Facundes de Melo  
- Erick Rios Sousa  
- Renan Henrique de Oliveira Sousa  
- Pedro Lazzarini Bittencourt de Freitas