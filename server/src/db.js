const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const { PARTICIPANTS, SHARED_PASSWORD } = require("./data/participants");

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL (or POSTGRES_URL) environment variable is required.");
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
});

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS participants (
      username TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      username TEXT PRIMARY KEY REFERENCES participants(username),
      answers JSONB NOT NULL DEFAULT '{}'::jsonb,
      completed BOOLEAN NOT NULL DEFAULT false,
      score INTEGER,
      percentage REAL,
      completed_at TIMESTAMPTZ,
      last_reaction TEXT
    );

    ALTER TABLE sessions ADD COLUMN IF NOT EXISTS last_reaction TEXT;
  `);
}

// Idempotent: only inserts participants that don't already exist, so
// redeploying never wipes anyone's in-progress or completed session.
async function seedParticipants() {
  const passwordHash = bcrypt.hashSync(SHARED_PASSWORD, 10);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const p of PARTICIPANTS) {
      await client.query(
        `INSERT INTO participants (username, display_name, password_hash)
         VALUES ($1, $2, $3)
         ON CONFLICT (username) DO NOTHING`,
        [p.username, p.displayName, passwordHash]
      );
      await client.query(
        `INSERT INTO sessions (username, answers, completed)
         VALUES ($1, '{}'::jsonb, false)
         ON CONFLICT (username) DO NOTHING`,
        [p.username]
      );
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

let readyPromise = null;
function ready() {
  if (!readyPromise) {
    readyPromise = migrate().then(seedParticipants);
  }
  return readyPromise;
}

module.exports = { pool, ready };
