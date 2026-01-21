const express = require("express");
const { getIRSAnswer } = require("./irs");

const app = express();
app.use(express.json());

app.post("/ask", (req, res) => {
  const { question } = req.body;
  const response = getIRSAnswer(question);
  res.json({
    receivedQuestion: question,
    answer: response.answer
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "USA Tax AI Backend",
    environment: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
