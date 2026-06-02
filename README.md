# Checklist de Instalação de Blimps

Aplicação web responsiva para controle de instalação de blimps em eventos.

## Stack

- **Frontend:** React + Vite, JavaScript, CSS puro, Axios, jsPDF
- **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, CORS, Dotenv

## Como rodar localmente

### 1. Pré-requisitos

- Node.js 18+
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
- Cluster MongoDB Atlas criado

### 2. Configurar o Backend

```bash
cd server
cp .env.example .env
```

Edite o arquivo `.env`:

```
PORT=3000
MONGODB_URI=mongodb+srv://usuario:senha@cluster.abcde.mongodb.net/checklist-blimps?retryWrites=true&w=majority
APP_KEY=minha-chave-secreta-super-segura
```

Instale as dependências e inicie:

```bash
npm install
npm run dev
```

O servidor inicia em `http://localhost:3000`.

**Seed automático:** Na primeira execução, o banco é populado com 27 locais em 9 cidades.

### 3. Configurar o Frontend

Crie o arquivo `.env` na pasta `frontend`:

```bash
cd frontend
```

Crie o arquivo `.env` com:

```
VITE_API_URL=http://localhost:3000
VITE_APP_KEY=minha-chave-secreta-super-segura
```

Instale e inicie:

```bash
npm install
npm run dev
```

O frontend abre em `http://localhost:5173`.

> **Importante:** A `VITE_APP_KEY` no frontend deve ser igual à `APP_KEY` no backend.

---

## Deploy na Vercel (Frontend)

1. Crie um repositório no GitHub e envie o projeto.

2. Acesse [vercel.com](https://vercel.com) e importe o repositório.

3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. Adicione as variáveis de ambiente no Vercel:
   - `VITE_API_URL` → URL do backend no Render (ex: `https://checklist-blimps.onrender.com`)
   - `VITE_APP_KEY` → mesma chave do backend

## Deploy no Render (Backend)

1. No [Render](https://render.com), clique em **New + > Web Service**.

2. Conecte o repositório GitHub.

3. Configure:
   - **Name:** `checklist-blimps-api`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. Adicione as variáveis de ambiente:
   - `PORT` → `3000`
   - `MONGODB_URI` → sua string de conexão do MongoDB Atlas
   - `APP_KEY` → sua chave secreta

5. Após o deploy, copie a URL gerada (ex: `https://checklist-blimps.onrender.com`) e use como `VITE_API_URL` no frontend.

## Rotas da API

| Método | Rota                    | Descrição               |
|--------|-------------------------|-------------------------|
| GET    | `/api/checklist`        | Lista todos os itens    |
| PATCH  | `/api/checklist/:id`    | Atualizar concluido     |
| PATCH  | `/api/checklist/reset`  | Resetar todos           |
| POST   | `/api/checklist/seed`   | Popular banco (admin)   |

Todas as rotas exigem header `x-app-key` com o valor de `APP_KEY`.

## Estrutura do Projeto

```
checklist-blimps/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Configuração do Axios
│   │   └── data/            # Dados de referência
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── index.js
│   ├── .env.example
│   └── package.json
└── README.md
```
