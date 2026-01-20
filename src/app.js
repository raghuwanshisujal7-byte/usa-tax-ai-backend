const express = require("express");

const app = express();

/**
 * Middlewares
 */
app.use(express.json());

/**
 * Health Check API
 * Used by Render, monitoring & debugging
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "USA Tax AI Backend",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

/**
 * Core API: Ask Tax Question (Skeleton)
 * AI logic will be plugged here later
 */
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      error: "Question is required"
    });
  }

  // TEMP response — AI will be added in next step
  res.status(200).json({
    question,
    answer: "AI engine not connected yet"
  });
});

module.exports = app;
