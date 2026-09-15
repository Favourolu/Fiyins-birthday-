const path = require("path");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");
const { PARTICIPANTS, SHARED_PASSWORD } = require("./data/participants");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "data.sqlite3");
const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS participants (
    username TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    username TEXT PRIMARY KEY REFERENCES participants(username),
    answers TEXT NOT NULL DEFAULT '{}',
    completed INTEGER NOT NULL DEFAULT 0,
    score INTEGER,
    percentage REAL,
    completed_at TEXT
  );
`);

function seedParticipants() {
  const existingCount = db.prepare("SELECT COUNT(*) AS c FROM participants").get().c;
  if (existingCount > 0) return;

  const passwordHash = bcrypt.hashSync(SHARED_PASSWORD, 10);
  const insertParticipant = db.prepare(
    "INSERT INTO participants (username, display_name, password_hash) VALUES (?, ?, ?)"
  );
  const insertSession = db.prepare(
    "INSERT INTO sessions (username, answers, completed) VALUES (?, '{}', 0)"
  );

  const seedTx = db.transaction(() => {
    for (const p of PARTICIPANTS) {
      insertParticipant.run(p.username, p.displayName, passwordHash);
      insertSession.run(p.username);
    }
  });
  seedTx();
}

seedParticipants();

module.exports = { db };
