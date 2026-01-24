# Environment Configuration

This project uses Vite's environment variable system to support different API endpoints for development and production.

## Environment Files

- `.env.development` - Used when running `npm run dev`
- `.env.production` - Used when running `npm run build`
- `.env.local` - (Optional) Local overrides, ignored by git

## Available Environment Variables

- `VITE_API_BASE_URL` - Base URL for inventory API
- `VITE_API_SNEAKERS_URL` - Base URL for sneakers API

## Setup

1. The default files are already configured:
   - Development: `http://localhost:8000`
   - Production: `https://api.production.com` (update this in `.env.production`)

2. For local overrides, create a `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` with your custom URLs.

## Usage

The API service automatically picks up these variables:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

**Important:** All environment variables must be prefixed with `VITE_` to be exposed to the client code.

## Commands

- `npm run dev` - Uses `.env.development`
- `npm run build` - Uses `.env.production`
