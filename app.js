const cors = require("cors");
const express = require("express");
const app = express();

const allowedOriginsRaw = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : ["*"];

// Render/other proxies set X-Forwarded-* headers
app.set("trust proxy", 1);

const originMatchers = allowedOriginsRaw.map((entry) => {
  if (entry === "*") return { type: "any" };
  if (entry.includes("*")) {
    const escaped = entry
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\\\*/g, ".*");
    return { type: "regex", value: new RegExp(`^${escaped}$`) };
  }
  return { type: "exact", value: entry };
});

const corsOptions = {
  origin: (origin, cb) => {
    // Non-browser clients (curl/postman) may not send Origin; allow them.
    if (!origin) return cb(null, true);

    for (const matcher of originMatchers) {
      if (matcher.type === "any") return cb(null, true);
      if (matcher.type === "exact" && matcher.value === origin)
        return cb(null, true);
      if (matcher.type === "regex" && matcher.value.test(origin))
        return cb(null, true);
    }
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("/*", cors(corsOptions));

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
