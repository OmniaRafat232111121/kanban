
Kanban board (Next.js, React Query, Zustand, MUI, dnd-kit). Tasks live in `db.json` and are exposed at `/api/tasks`.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

Set `NEXT_PUBLIC_API_URL` only if you use `npm run api` (json-server on port 4000) instead of `/api`.

## Scripts

- `npm run dev` — dev server
- `npm run api` — json-server (optional)
- `npm run build` / `npm start` — production

## API

- `GET /api/tasks?column=&_page=&_limit=&q=`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

Column values: `backlog`, `in_progress`, `review`, `done`.


<img width="1920" height="912" alt="screencapture-localhost-3000-2026-03-28-01_28_59" src="https://github.com/user-attachments/assets/0bf31176-7fa4-4e11-b2cb-91003888284d" />

