const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Root check
app.get("/", (req, res) => {
  res.json({
    message: "USA Tax AI Backend is running"
  });
});

// Health check (already working)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "USA Tax AI Backend",
    environment: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString()
  });
});

// 🔥 MAIN ASK ROUTE (THIS WAS MISSING)
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      error: "Question is required"
    });
  }

  // Dummy response (IRS logic baad me aayega)
  return res.json({
    answer: "IRS logic coming soon. Backend is working perfectly.",
    receivedQuestion: question
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

module.exports = app;
