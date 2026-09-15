require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const testRoutes = require("./routes/test");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

app.use(express.json());
app.use(cookieParser());
if (CLIENT_ORIGIN) {
  app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
}

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/admin", adminRoutes);

const clientDist = path.join(__dirname, "..", "..", "client", "dist");
app.use(express.static(clientDist));
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Fiyin's Birthday Aptitude Challenge server running on port ${PORT}`);
});
