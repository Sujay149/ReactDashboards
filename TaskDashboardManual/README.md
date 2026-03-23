# Task Dashboard (Vite + json-server)

This dashboard now uses `json-server` as a mock backend instead of static in-app task data.

## Scripts

- `npm run dev` - starts Vite only.
- `npm run server` - starts json-server on `http://localhost:3001`.
- `npm run dev:all` - starts both Vite and json-server together.

## API Source

- Data file: `db.json`
- Tasks endpoint: `GET http://localhost:3001/tasks`

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Run app + API server together:

```bash
npm run dev:all
```
