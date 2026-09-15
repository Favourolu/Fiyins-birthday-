const path = require("path");
const express = require("express");
const app = require("./app");

const PORT = process.env.PORT || 4000;

// Local/traditional-host mode: serve the built client and fall back to it
// for any non-API route (client-side routing). Not used on Vercel, where
// the client is deployed as a separate static build.
const clientDist = path.join(__dirname, "..", "..", "client", "dist");
app.use(express.static(clientDist));
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Fiyin's Birthday Aptitude Challenge server running on port ${PORT}`);
});
