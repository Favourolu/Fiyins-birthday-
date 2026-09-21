const express = require("express");
const { pool } = require("../db");
const { requireParticipant } = require("../auth");

const router = express.Router();

// Gated on the caller's own session being completed, so nobody can peek at
// the leaderboard while they're still mid-test (keeps the "genuinely
// unsure" suspense intact) — but once you've submitted, you can see how
// everyone else who's finished stacks up.
router.get("/", requireParticipant, async (req, res) => {
  const { rows: ownRows } = await pool.query(
    "SELECT completed FROM sessions WHERE username = $1",
    [req.username]
  );
  if (!ownRows[0]?.completed) {
    return res.status(403).json({ error: "Finish your test to see the leaderboard." });
  }

  const { rows } = await pool.query(
    `SELECT p.username, p.display_name, s.score, s.percentage, s.completed_at
     FROM participants p JOIN sessions s ON s.username = p.username
     WHERE s.completed = true
     ORDER BY s.score DESC, s.completed_at ASC`
  );

  const leaderboard = rows.map((r, i) => ({
    rank: i + 1,
    displayName: r.display_name,
    score: r.score,
    percentage: r.percentage,
    isYou: r.username === req.username,
  }));

  res.json({ leaderboard, total: rows.length });
});

module.exports = router;
