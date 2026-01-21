const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.json({
    service: "USA Tax AI Backend",
    message: "Backend is live",
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "USA Tax AI Backend",
    environment: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString(),
  });
});

// ASK endpoint (IRS engine placeholder)
app.post("/ask", (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      error: "Question is required",
    });
  }

  // 🔒 TEMP: rule-based response (no AI yet)
  res.json({
    source: "IRS_RULE_ENGINE",
    question,
    answer:
      "This is a placeholder response. IRS rules engine will be connected next.",
    disclaimer:
      "This response is for informational purposes only and is not tax advice.",
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

module.exports = app;
