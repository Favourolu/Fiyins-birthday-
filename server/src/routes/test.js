const express = require("express");
const { db } = require("../db");
const { QUESTIONS } = require("../data/questions");
const { requireParticipant } = require("../auth");

const router = express.Router();

// One attempt per participant by default. Set ALLOW_RETAKE=true to let
// participants take the test again (their previous session is reset).
const ALLOW_RETAKE = process.env.ALLOW_RETAKE === "true";

const PUBLIC_QUESTIONS = QUESTIONS.map(({ id, section, question, options }) => ({
  id,
  section,
  question,
  options,
}));

const TOTAL_QUESTIONS = QUESTIONS.length;
const validOptionSets = new Map(QUESTIONS.map((q) => [q.id, new Set(q.options)]));

function getSession(username) {
  return db.prepare("SELECT * FROM sessions WHERE username = ?").get(username);
}

router.get("/questions", requireParticipant, (req, res) => {
  res.json({ questions: PUBLIC_QUESTIONS, total: TOTAL_QUESTIONS });
});

router.get("/status", requireParticipant, (req, res) => {
  const session = getSession(req.username);
  const answers = JSON.parse(session.answers);
  res.json({
    completed: !!session.completed,
    answers,
    score: session.completed ? session.score : undefined,
    percentage: session.completed ? session.percentage : undefined,
    total: TOTAL_QUESTIONS,
  });
});

router.post("/answer", requireParticipant, (req, res) => {
  const session = getSession(req.username);
  if (session.completed) {
    return res.status(403).json({ error: "Test already submitted." });
  }

  const { questionId, answer } = req.body || {};
  const validOptions = validOptionSets.get(questionId);
  if (!validOptions || !validOptions.has(answer)) {
    return res.status(400).json({ error: "Invalid question or answer option." });
  }

  const answers = JSON.parse(session.answers);
  answers[questionId] = answer;
  db.prepare("UPDATE sessions SET answers = ? WHERE username = ?").run(
    JSON.stringify(answers),
    req.username
  );
  res.json({ ok: true });
});

router.post("/submit", requireParticipant, (req, res) => {
  const session = getSession(req.username);
  if (session.completed) {
    return res.status(403).json({ error: "Test already submitted." });
  }

  const answers = JSON.parse(session.answers);
  const unanswered = QUESTIONS.filter((q) => !(q.id in answers));
  if (unanswered.length > 0) {
    return res.status(400).json({
      error: "Please answer every question before submitting.",
      unansweredIds: unanswered.map((q) => q.id),
    });
  }

  let score = 0;
  for (const q of QUESTIONS) {
    if (answers[q.id] === q.correctAnswer) score += 1;
  }
  const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);

  db.prepare(
    "UPDATE sessions SET completed = 1, score = ?, percentage = ?, completed_at = ? WHERE username = ?"
  ).run(score, percentage, new Date().toISOString(), req.username);

  res.json({ score, total: TOTAL_QUESTIONS, percentage });
});

router.post("/retake", requireParticipant, (req, res) => {
  if (!ALLOW_RETAKE) {
    return res.status(403).json({ error: "Retakes are not enabled." });
  }
  db.prepare(
    "UPDATE sessions SET answers = '{}', completed = 0, score = NULL, percentage = NULL, completed_at = NULL WHERE username = ?"
  ).run(req.username);
  res.json({ ok: true });
});

module.exports = router;
