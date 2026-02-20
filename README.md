# EchoLog Server

Node/Express + MongoDB API for EchoLog.

## Environment variables

Create a `.env` locally (do not commit it). See `.env.example`.

- `MONGO_URI`
- `JWT_SECRET`
- `PORT` (optional; Render sets this automatically)
- `CORS_ORIGIN` (optional; comma-separated list or `*`)

## Run locally

```bash
npm install
npm start
```

Health check:

- `GET /health`

## Deploy to Render

This repo includes `render.yaml` for one-click deploy.

In Render, set the required env vars:

- `MONGO_URI`
- `JWT_SECRET`
- `CORS_ORIGIN` (set to your frontend URL; for example `https://your-frontend.vercel.app`)

