# Fiyin's Birthday Aptitude Challenge

A full-stack birthday aptitude-test platform: a 3D landing page, per-participant
login, a one-question-at-a-time test (17 questions across 4 sections), a
locked-until-submit result reveal, and an admin dashboard.

## Stack

- **Server**: Node.js, Express, SQLite (`better-sqlite3`), bcrypt password
  hashing, JWT session cookies. This is where the questions, the answer key,
  and every participant's session/score live — none of it is ever sent to the
  browser except what's needed to render the current question.
- **Client**: React + TypeScript, Vite, Tailwind CSS v4, Framer Motion,
  Three.js / React Three Fiber for the landing page.

## Why a real backend

A purely static site can't satisfy the spec's own rules: the answer key must
never reach the browser, and the admin dashboard must show *every*
participant's result, not just whatever happens to be in one guest's browser
storage. So this ships as an Express API + SQLite database that the built
React app talks to, with the score always computed server-side.

## Project layout

```
/server
  src/
    data/questions.js      # the 17 questions, options, and section names — verbatim from the source questionnaire
    data/participants.js   # the 18 usernames, generated from the guest list
    db.js                  # SQLite schema + seeding
    auth.js                # JWT session helpers, participant vs admin auth
    routes/auth.js          POST /api/auth/login, /logout, /admin/login, /admin/logout
    routes/test.js           GET /api/test/questions (no answers), /status; POST /answer, /submit
    routes/admin.js          GET /api/admin/results
    index.js               # serves the built client + the API
/client
  src/
    pages/                 Landing, Login, Test, Result, AdminLogin, Admin
    components/            BirthdayScene (3D), QuestionCard, ProgressBar, SubmitModal, Confetti
    lib/api.ts             typed fetch client
```

## Running it locally

```bash
# 1. Server
cd server
cp .env.example .env   # then edit JWT_SECRET / ADMIN_PASSWORD
npm install
npm run dev             # http://localhost:4000 (API only, until the client is built)

# 2. Client (separate terminal)
cd client
npm install
npm run dev              # http://localhost:5173, proxies /api to :4000
```

For a production-style run, build the client and let the server serve it:

```bash
cd client && npm install && npm run build
cd ../server && npm install && npm start   # serves the built client + API on :4000
```

The SQLite database file (`server/data.sqlite3`) is created and seeded with
all 18 participants automatically on first boot. Delete it to reset every
participant's progress back to "Not Started".

## Credentials

- Every participant's password is the shared one you provided: `Fiyin@22`.
- Usernames are generated from the guest list as `name123` (lowercase name +
  `123`) in `server/src/data/participants.js`. The list has "Idowu" and
  "idowu" twice — since usernames must be unique, the second one became
  `idowu2123` (displayed as "Idowu 2"). Rename that entry in
  `participants.js` if there's a real distinct second name, then delete
  `data.sqlite3` so it reseeds.
- The admin dashboard (`/admin/login`) uses **separate** credentials from
  `.env` (`ADMIN_USERNAME` / `ADMIN_PASSWORD`), defaulting to
  `admin` / `FiyinAdmin@2026` if unset — change this before sharing the link.
- I'm not committing the generated username list to this README/repo since
  it'll be pushed to a shared branch — see the chat where I built this for
  the full list, or run `node -e "console.log(require('./server/src/data/participants').PARTICIPANTS)"`
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

- `ALLOW_RETAKE=false` (default) — one attempt per participant. Set to `true`
  to let participants retake the test.
- `JWT_SECRET` — change this before deploying anywhere real.
