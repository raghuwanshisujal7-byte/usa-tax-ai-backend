const express = require("express");
const cors = require("cors");

const app = express();

/* =========================
   GLOBAL MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   ROUTES
========================= */

// IRS related routes (agar pehle se hai)
app.use("/api/irs", require("./irs/router"));

// ✅ AI ROUTE (STEP 4.3 — YEHI ADD KARNA THA)
app.use("/api/ai", require("./routes/ai"));

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "USA Tax AI Backend running 🚀",
  });
});

module.exports = app;
