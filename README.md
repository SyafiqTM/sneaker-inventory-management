## Sneaker Inventory Management – Setup Guide

This project is a React + Vite front‑end for a sneaker inventory management API.
Use this guide to install dependencies and run both the API and the front‑end locally, and to build the Vite app for production.

---

## 1. Prerequisites

- Node.js 18+ and npm
- An inventory API running locally (default: `http://localhost:8000/api/v1.0/`)

If your API uses a different host/port or path, you can override the defaults using Vite environment variables (see **Environment variables** below).

---

## 2. Install dependencies

From the project root (`sneaker-inventory-management`):

```bash
npm install
```

This installs all front‑end dependencies declared in `package.json`.

---

## 3. API setup and configuration

The front‑end talks to three API base URLs, configured via Vite env vars in [src/services/api.js](src/services/api.js):

- `VITE_ROOT_URL` – session API base (default `http://localhost:8000/api/v1.0/`)
- `VITE_API_BASE_URL` – inventory items base (default `http://localhost:8000/api/v1.0/inventory/`)
- `VITE_API_SNEAKERS_URL` – sneakers items base (default `http://localhost:8000/api/v1.0/sneakers/`)

### 3.1. Running the API

Start your API server so it is reachable at the URLs above (or your own equivalents).

If you use different URLs, create a `.env.local` file in the project root (not committed to Git) and set your own values:

```bash
VITE_ROOT_URL=http://localhost:9000/api/v1.0/
VITE_API_BASE_URL=http://localhost:9000/api/v1.0/inventory/
VITE_API_SNEAKERS_URL=http://localhost:9000/api/v1.0/sneakers/
```

Restart Vite after changing env files.

---

## 4. Run the front‑end (Vite dev server)

To run the React front‑end locally with hot reloading:

```bash
npm run dev
```

By default Vite serves the app on `http://localhost:5173/`.

Make sure your API is running before using the app, otherwise network requests will fail.

---

## 5. Build and preview the Vite app  

### 5.1. Build for production (Require Domain/Cloud Server)

```bash
npm run build
```

This runs `vite build` and outputs static assets to the `dist/` folder.

### 5.2. Preview the production build locally

After building, you can preview the production bundle using Vite’s preview server:

```bash
npm run preview
```

Alternatively, you can use the combined script defined in `package.json`:

```bash
npm start
```

This will build the app and then run `vite preview`.

---

## 6. Linting

To run ESLint checks:

```bash
npm run lint
```

---

## 7. Summary of useful scripts

- `npm run dev` – start Vite dev server (front‑end only)
- `npm run build` – build production assets
- `npm run preview` – serve built assets locally
- `npm start` – build then preview (shortcut)
- `npm run lint` – run ESLint

