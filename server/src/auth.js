const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-only-secret-change-me";
const COOKIE_NAME = "fiyin_session";
const ADMIN_COOKIE_NAME = "fiyin_admin_session";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "FiyinAdmin@2026";

function signParticipantToken(username) {
  return jwt.sign({ role: "participant", username }, JWT_SECRET, { expiresIn: "12h" });
}

function signAdminToken() {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "12h" });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function requireParticipant(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  const payload = token && verifyToken(token);
  if (!payload || payload.role !== "participant") {
    return res.status(401).json({ error: "Not authenticated." });
  }
  req.username = payload.username;
  next();
}

function requireAdmin(req, res, next) {
  const token = req.cookies[ADMIN_COOKIE_NAME];
  const payload = token && verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return res.status(401).json({ error: "Not authenticated." });
  }
  next();
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 12 * 60 * 60 * 1000,
};

module.exports = {
  COOKIE_NAME,
  ADMIN_COOKIE_NAME,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  cookieOptions,
  signParticipantToken,
  signAdminToken,
  requireParticipant,
  requireAdmin,
};
