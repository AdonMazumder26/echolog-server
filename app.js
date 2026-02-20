const cors = require("cors");
const express = require("express");
const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean)
  : ["*"];

// Render/other proxies set X-Forwarded-* headers
app.set("trust proxy", 1);

if (allowedOrigins.length === 1 && allowedOrigins[0] === "*") {
  // Credentials + wildcard origin is invalid in browsers
  app.use(cors({ origin: "*" }));
} else {
  app.use(cors({ origin: allowedOrigins, credentials: true }));
}

// Allow small avatar images as data URLs (base64) during signup.
app.use(express.json({ limit: "5mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use(require("./routes/authRoutes"));
app.use(require("./routes/memoryRoutes"));

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
