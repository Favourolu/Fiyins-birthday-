const express = require("express");
const bcrypt = require("bcryptjs");
const { pool } = require("../db");
const {
  COOKIE_NAME,
  ADMIN_COOKIE_NAME,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  cookieOptions,
  signParticipantToken,
  signAdminToken,
  requireParticipant,
  requireAdmin,
} = require("../auth");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Invalid username or password." });
  }

  const { rows } = await pool.query(
    "SELECT username, password_hash FROM participants WHERE username = $1",
    [username.trim().toLowerCase()]
  );
  const participant = rows[0];

  const valid = participant && bcrypt.compareSync(password, participant.password_hash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const token = signParticipantToken(participant.username);
  res.cookie(COOKIE_NAME, token, cookieOptions);
  res.json({ ok: true });
});

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ ok: true });
});

router.get("/me", requireParticipant, async (req, res) => {
  const { rows } = await pool.query(
    "SELECT username, display_name FROM participants WHERE username = $1",
    [req.username]
  );
  const participant = rows[0];
  res.json({ username: participant.username, displayName: participant.display_name });
});

router.post("/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid admin credentials." });
  }
  const token = signAdminToken();
  res.cookie(ADMIN_COOKIE_NAME, token, cookieOptions);
  res.json({ ok: true });
});

router.post("/admin/logout", (req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME);
  res.json({ ok: true });
});

router.get("/admin/me", requireAdmin, (req, res) => {
  res.json({ ok: true });
});

module.exports = router;
