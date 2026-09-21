require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { ready } = require("./db");
const authRoutes = require("./routes/auth");
const testRoutes = require("./routes/test");
const adminRoutes = require("./routes/admin");
const leaderboardRoutes = require("./routes/leaderboard");

const app = express();
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

app.use(express.json());
app.use(cookieParser());
if (CLIENT_ORIGIN) {
  app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
}

// Ensures tables exist and participants are seeded before any request is
// handled — cheap after the first call since `ready()` memoizes the promise.
app.use(async (req, res, next) => {
  try {
    await ready();
    next();
  } catch (err) {
    next(err);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

module.exports = app;
