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

module.exports = router;
