const express = require("express");
const { pool } = require("../db");
const { requireAdmin } = require("../auth");

const router = express.Router();

router.get("/results", requireAdmin, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT p.username, p.display_name, s.completed, s.answers, s.score, s.percentage, s.completed_at
     FROM participants p JOIN sessions s ON s.username = p.username
     ORDER BY LOWER(p.display_name)`
  );

  const results = rows.map((r) => {
    const answeredCount = Object.keys(r.answers || {}).length;
    const status = r.completed ? "Completed" : answeredCount > 0 ? "In Progress" : "Not Started";
    return {
      username: r.username,
      displayName: r.display_name,
      status,
      score: r.completed ? r.score : null,
      percentage: r.completed ? r.percentage : null,
      completedAt: r.completed_at,
    };
  });

  res.json({ results });
});

// Resets a single participant's session (answers, completion, score, last
// reaction) so they can take the test again. Independent of ALLOW_RETAKE —
// that flag controls whether participants can reset themselves; this lets
// an admin do it for one person on demand (testing, or a technical hiccup
// mid-event) without changing that global setting.
router.post("/reset/:username", requireAdmin, async (req, res) => {
  const { rowCount } = await pool.query(
    `UPDATE sessions
     SET answers = '{}'::jsonb, completed = false, score = NULL, percentage = NULL,
         completed_at = NULL, last_reaction = NULL
     WHERE username = $1`,
    [req.params.username]
  );
  if (rowCount === 0) {
    return res.status(404).json({ error: "No participant with that username." });
  }
  res.json({ ok: true });
});

module.exports = router;
