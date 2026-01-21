const express = require("express");
const router = express.Router();

// ✅ correct relative paths
const credits = require("./credits");
const deductions = require("../deductions");

router.post("/ask", (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      error: "Question is required"
    });
  }

  const q = question.toLowerCase();
  let insights = [];

  if (q.includes("credit")) {
    insights = credits;
  } 
  else if (q.includes("deduction")) {
    insights = deductions;
  } 
  else if (q.includes("save tax") || q.includes("reduce tax")) {
    insights = [...deductions, ...credits];
  } 
  else {
    insights = [
      { note: "IRS logic engine v1: No exact match, generic guidance returned." }
    ];
  }

  res.json({
    answer: "IRS logic engine v1 executed successfully.",
    receivedQuestion: question,
    insights
  });
});

module.exports = router;
