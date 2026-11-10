# MindWell AI

A learning-first MERN wellness app with a React + Vite frontend and an Express API.

## Project structure

```text
mindwell-ai/
├── client/
│   ├── src/
│   │   ├── components/       # React page components
│   │   ├── styles/           # Styles grouped by page/component
│   │   ├── utils/            # Local storage helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css        # CSS entry point (imports styles/*.css)
│   └── package.json
├── server/
│   ├── src/server.js
│   ├── .env.example
│   └── package.json
└── package.json
```

## CSS organization

The frontend stylesheet is split into focused files under `client/src/styles/`:
- `global.css` — theme variables, typography, base layout and dashboard foundation
- `mood-tracker.css` and `mood-tracker-overrides.css` — mood check-in UI
- `mood-changer.css` and `mood-changer-overrides.css` — interactive mood activities
- `wellness-overview.css` — insights and chart styling
- `wellness-tools.css` — wellness toolkit and assistant-related styling
- `mood-history.css` — mood history
- `daily-tips.css` — daily wellness tips
- `breathing-exercise.css` — breathing exercise page
- `weekly-report.css` — weekly report
- `layout-effects.css`, `layout-polish.css`, `ambient-effects.css` — shared responsive, motion and visual refinements

Keep `client/src/styles.css` as the single CSS entry point. It imports the files in cascade order. Add new component styles to the matching file rather than rebuilding one large stylesheet.

## Requirements
- Node.js 20+ recommended
- npm

## Run locally

From the project root:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

Create `server/.env` from the example file:

**Windows PowerShell**
```powershell
Copy-Item server/.env.example server/.env
```

**macOS / Linux**
```bash
cp server/.env.example server/.env
```

Then start the frontend and backend together:

```bash
npm run dev
```

Open the Vite URL shown in the terminal (usually http://localhost:5173).
The API health check is usually available at http://localhost:5000/api/health.

## Wellness metrics and AI reflections

Sleep, water, steps, and optional weight can be logged with a mood check-in and are saved in the browser's local check-in history. On the Daily tips page, **Ask AI to review** sends up to the 7 most recent moods, stress scores, and wellness metrics to the Express server and its configured OpenAI API. Journal notes are excluded. The request is made only when the user selects the button. The Responses API call disables response storage with `store: false`.

To enable AI reflections, add an OpenAI API key to `server/.env` as `OPENAI_API_KEY=...`. Keep the key on the server and never put it in a `VITE_` variable. You can set `OPENAI_MODEL` there to another model available to your API project. Without a key or reachable AI service, Daily tips shows a clearly labeled on-device reflection instead.

## Notes
- `node_modules` is intentionally not included in this ZIP. Run the install commands above after extracting.
- Do not commit real secrets from `server/.env`.
- No real health data should be entered into this demo. It is not a medical diagnostic system.
