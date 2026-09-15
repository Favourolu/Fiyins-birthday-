const express = require("express");
const { pool } = require("../db");
const { QUESTIONS } = require("../data/questions");
const { pickReaction } = require("../data/reactions");
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
const correctAnswerById = new Map(QUESTIONS.map((q) => [q.id, q.correctAnswer]));

async function getSession(username) {
  const { rows } = await pool.query("SELECT * FROM sessions WHERE username = $1", [username]);
  return rows[0];
}

router.get("/questions", requireParticipant, (req, res) => {
  res.json({ questions: PUBLIC_QUESTIONS, total: TOTAL_QUESTIONS });
});

router.get("/status", requireParticipant, async (req, res) => {
  const session = await getSession(req.username);
  res.json({
    completed: !!session.completed,
    answers: session.answers,
    score: session.completed ? session.score : undefined,
    percentage: session.completed ? session.percentage : undefined,
    total: TOTAL_QUESTIONS,
  });
});

// This is a one-shot lock-in, not a draft save: once a question id is a key
// in `answers`, it is permanent for this session — the option can never be
// changed, including by calling this route again for the same question.
// The response deliberately never includes whether the answer was correct;
// the server itself picks the ambiguous reaction text so that information
// can't be recovered by inspecting network responses either.
router.post("/answer", requireParticipant, async (req, res) => {
  const session = await getSession(req.username);
  if (session.completed) {
    return res.status(403).json({ error: "Test already submitted." });
  }

  const { questionId, answer } = req.body || {};
  const validOptions = validOptionSets.get(questionId);
  if (!validOptions || !validOptions.has(answer)) {
    return res.status(400).json({ error: "Invalid question or answer option." });
  }

  if (questionId in session.answers) {
    return res.status(403).json({ error: "This answer is already locked in." });
  }

  const isCorrect = answer === correctAnswerById.get(questionId);
  const reaction = pickReaction(isCorrect, session.last_reaction);
  const answers = { ...session.answers, [questionId]: answer };

  await pool.query("UPDATE sessions SET answers = $1, last_reaction = $2 WHERE username = $3", [
    JSON.stringify(answers),
    reaction,
    req.username,
  ]);
  res.json({ ok: true, reaction });
});

router.post("/submit", requireParticipant, async (req, res) => {
  const session = await getSession(req.username);
  if (session.completed) {
    return res.status(403).json({ error: "Test already submitted." });
  }

  const answers = session.answers;
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

  await pool.query(
    "UPDATE sessions SET completed = true, score = $1, percentage = $2, completed_at = now() WHERE username = $3",
    [score, percentage, req.username]
  );

  res.json({ score, total: TOTAL_QUESTIONS, percentage });
});

router.post("/retake", requireParticipant, async (req, res) => {
  if (!ALLOW_RETAKE) {
    return res.status(403).json({ error: "Retakes are not enabled." });
  }
  await pool.query(
    "UPDATE sessions SET answers = '{}'::jsonb, completed = false, score = NULL, percentage = NULL, completed_at = NULL, last_reaction = NULL WHERE username = $1",
    [req.username]
  );
  res.json({ ok: true });
});

module.exports = router;
