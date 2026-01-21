const express = require("express");
const cors = require("cors");
const { getIRSAnswer } = require("./irs/router");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "USA Tax AI Backend",
    environment: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString()
  });
});

app.post("/ask", (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      error: "Question is required"
    });
  }

  const result = getIRSAnswer(question);

  res.json({
    question,
    category: result.type,
    answer: result.answer
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = app;
