# 📱 Frontend — App React (Expo)

Interface para visualização de **status**, **histórico**, **métricas** e **relatórios** do sistema FESTO.

---

## 📦 Stack & Requisitos

- Node.js 18+
- npm (ou yarn/pnpm)
- Expo (via `npx expo`)

---

## 🔧 Setup & Execução

```bash
cd frontend
npm install
npm start 
```

> Abra no navegador (Web) ou no app **Expo Go** (mobile), conforme sua necessidade.

---

## 🔐 Variáveis de Ambiente

Crie um arquivo **`.env`** em `frontend/` (exemplo):

```env
VITE_API_BASE_URL=http://127.0.0.1:5000
```

No código, leia usando `process.env.VITE_API_BASE_URL` (ou a lib de env que você utiliza).  
> Ajuste conforme onde o backend está rodando (localhost/servidor).

---

## 🧭 Scripts úteis

```bash
npm start    
npm run build  
```

---

## 🧱 Estrutura (sugerida)

```text
frontend/
├─ src/
│  ├─ components/       # UI (Charts, Cards, etc.)
│  ├─ pages/            # telas (Status, Histórico, Métricas, Config)
│  ├─ services/         # api.ts (fetch/axios), mapeamento de endpoints
│  ├─ hooks/            # hooks de dados/estado
│  ├─ styles/           # Tailwind/tema/StyleSheet
│  └─ main.tsx / App.tsx
├─ .env
├─ package.json
└─ README.md
```

---

## 📡 Integração com a API

- **Base URL**: `process.env.VITE_API_BASE_URL`
- **Endpoints esperados**:
  - `GET /api/cylinder/status`
  - `GET /api/cylinder/history?tag=<TAG>`

Dica: centralize chamadas HTTP em `services/api.ts` com `fetch`/`axios` + interceptors.

---

## 🧰 Boas práticas de UI

- Estados explícitos
- Tooltips e legenda nos gráficos
- Acessibilidade (labels, contraste)
- Layout responsivo (web) e responsivo à densidade (mobile)