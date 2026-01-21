const express = require("express");
const router = express.Router();

// correct relative paths
const deductions = require("../deductions");
const credits = require("./credits");

router.post("/ask", (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  const q = question.toLowerCase();

  let response = {
    answer: "IRS logic coming soon. Backend is working perfectly.",
    receivedQuestion: question
  };

  if (q.includes("deduction")) {
    response.answer = deductions.basicDeductions;
  }

  if (q.includes("credit")) {
    response.answer = credits.basicCredits;
  }

  res.json(response);
});

module.exports = router;
