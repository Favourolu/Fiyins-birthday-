# Fiyin's Birthday Aptitude Challenge

A full-stack birthday aptitude-test platform: a 3D landing page, per-participant
login, a one-question-at-a-time test (17 questions across 4 sections), a
locked-until-submit result reveal, and an admin dashboard.

## Stack

- **Server**: Node.js, Express, PostgreSQL (`pg`), bcrypt password hashing,
  JWT session cookies. This is where the questions, the answer key, and every
  participant's session/score live — none of it is ever sent to the browser
  except what's needed to render the current question.
- **Client**: React + TypeScript, Vite, Tailwind CSS v4, Framer Motion,
  Three.js / React Three Fiber for the landing page.
- Deployed on **Vercel**: the client as a static build, the API as a
  serverless function (`/api`), backed by a Postgres database (e.g. the Neon
  integration via Vercel's storage marketplace) so results persist reliably
  between requests and deploys.

## Why a real backend

A purely static site can't satisfy the spec's own rules: the answer key must
never reach the browser, and the admin dashboard must show *every*
participant's result, not just whatever happens to be in one guest's browser
storage. So this ships as an Express API + Postgres database that the built
React app talks to, with the score always computed server-side.

## Project layout

```
/api
  index.js                 # Vercel serverless entry point — re-exports the Express app
/server
  src/
    data/questions.js      # the 17 questions, options, and section names — verbatim from the source questionnaire
    data/participants.js   # the 18 usernames, generated from the guest list
    db.js                  # Postgres pool, schema migration, idempotent seeding
    auth.js                # JWT session helpers, participant vs admin auth
    app.js                 # the Express app (routes, middleware) — no app.listen
    index.js               # local/traditional-host entry point: app.listen + serves built client
    routes/auth.js          POST /api/auth/login, /logout, /admin/login, /admin/logout
    routes/test.js           GET /api/test/questions (no answers), /status; POST /answer, /submit
    routes/admin.js          GET /api/admin/results
/client
  src/
    pages/                 Landing, Login, Test, Result, AdminLogin, Admin
    components/            BirthdayScene (3D), QuestionCard, ProgressBar, SubmitModal, Confetti
    lib/api.ts             typed fetch client
/package.json              # dependencies for the /api serverless function (Vercel builds from repo root)
/vercel.json                build/output config + rewrite so /api/* hits the one function
```

## Running it locally

You need a Postgres database reachable from your machine (a local install, a
Docker container, or the same connection string your Vercel project uses).

```bash
# 1. Server
cd server
cp .env.example .env   # set DATABASE_URL, JWT_SECRET, ADMIN_PASSWORD
npm install
npm run dev              # http://localhost:4000 (API only, until the client is built)

# 2. Client (separate terminal)
cd client
npm install
npm run dev               # http://localhost:5173, proxies /api to :4000
```

For a production-style local run, build the client and let the server serve it:

```bash
cd client && npm install && npm run build
cd ../server && npm install && npm start   # serves the built client + API on :4000
```

Tables are created and participants are (re-)seeded automatically on first
request — seeding is idempotent (`ON CONFLICT DO NOTHING`), so redeploying or
restarting the server never wipes anyone's in-progress or completed session.

## Deploying on Vercel

1. Push this repo to GitHub (already done if you're reading this on the
   deployed branch).
2. Create the Vercel project linked to the repo (root directory = repo root).
3. Add a Postgres database to the project — easiest via the Vercel dashboard:
   **Project → Storage → Create Database → Postgres** (the free Neon-backed
   plan is enough for an 18-person test), or from the CLI: `vercel install neon`.
   This injects a `POSTGRES_URL` env var automatically, which the app reads.
4. Set the remaining environment variables in the Vercel dashboard
   (**Project → Settings → Environment Variables**): `JWT_SECRET`,
   `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and optionally `ALLOW_RETAKE`.
5. Deploy. `vercel.json` handles the rest: it builds `client/` as the static
   site and rewrites all `/api/*` requests to the single `/api/index.js`
   serverless function, which is the same Express app used locally.

## Credentials

- Every participant's password is the shared one you provided: `Fiyin@22`.
- Usernames are generated from the guest list as `name123` (lowercase name +
  `123`) in `server/src/data/participants.js`. The list has "Idowu" and
  "idowu" twice — since usernames must be unique, the second one became
  `idowu2123` (displayed as "Idowu 2"). Rename that entry in
  `participants.js` if there's a real distinct second name, then redeploy —
  seeding is additive, so existing accounts are untouched.
- The admin dashboard (`/admin/login`) uses **separate** credentials from
  `.env` (`ADMIN_USERNAME` / `ADMIN_PASSWORD`), defaulting to
  `admin` / `FiyinAdmin@2026` if unset — change this before sharing the link.
- The full username list isn't committed to this README since it'll live on
  a shared branch — it was sent directly in the chat where this was built, or
  run `node -e "console.log(require('./server/src/data/participants').PARTICIPANTS)"`
  from the repo root.

## Answer key

The correct answer for each question is a fixed `correctAnswer` field in
`server/src/data/questions.js` — the questionnaire image didn't include a
marked answer key, so I worked through all 17 questions myself (math ones are
deterministic; the verbal/critical-thinking ones use the single
clearly-best option). If any of them don't match your intended key, edit that
file directly.

## Configuration

See `server/.env.example`:

- `DATABASE_URL` — Postgres connection string (locally, or copy the value
  Vercel's Postgres integration provisions).
- `ALLOW_RETAKE=false` (default) — one attempt per participant. Set to `true`
  to let participants retake the test.
- `JWT_SECRET` — change this before deploying anywhere real.
