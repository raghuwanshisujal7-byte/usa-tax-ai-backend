const express = require("express");
const router = express.Router();

const credits = require("./credits");
const deductions = require("./deductions");

/**
 * POST /ask
 * Body: { question: string }
 */
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
  } else if (q.includes("deduction")) {
    insights = deductions;
  } else if (q.includes("save tax") || q.includes("reduce tax")) {
    insights = [
      ...deductions,
      ...credits
    ];
  } else {
    insights = [
      {
        note: "General IRS tax planning logic will be applied here"
      }
    ];
  }

  res.json({
    answer: "IRS logic engine v1 executed successfully.",
    receivedQuestion: question,
    insights
  });
});

module.exports = router;
