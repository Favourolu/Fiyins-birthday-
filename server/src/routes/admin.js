const express = require("express");
const { db } = require("../db");
const { requireAdmin } = require("../auth");

const router = express.Router();

router.get("/results", requireAdmin, (req, res) => {
  const rows = db
    .prepare(
      "SELECT p.username, p.display_name, s.completed, s.answers, s.score, s.percentage, s.completed_at " +
        "FROM participants p JOIN sessions s ON s.username = p.username " +
        "ORDER BY p.display_name COLLATE NOCASE"
    )
    .all();

  const results = rows.map((r) => {
    const answeredCount = Object.keys(JSON.parse(r.answers)).length;
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
