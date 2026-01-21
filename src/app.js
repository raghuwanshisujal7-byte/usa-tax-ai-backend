const express = require("express");
const { getIRSAnswer } = require("./irs");

const app = express();

// Middleware
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "USA Tax AI Backend",
    environment: "production",
    timestamp: new Date().toISOString()
  });
});

// MAIN ASK ENDPOINT (🔥 REAL IRS LOGIC)
app.post("/ask", (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Question is required"
      });
    }

    const result = getIRSAnswer(question);

    return res.json({
      category: result.category,
      answer: result.answer
    });

  } catch (err) {
    console.error("IRS Engine Error:", err);
    res.status(500).json({
      error: "Internal IRS Engine Error"
    });
  }
});

module.exports = app;
