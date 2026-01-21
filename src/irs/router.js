const express = require("express");
const router = express.Router();

// IRS rule modules (static for now)
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

  // 🔹 Phase 1: deterministic placeholder logic
  // (AI + IRS engine will replace this later)

  let insights = [];

  if (/credit/i.test(question)) {
    insights = credits;
  } else if (/deduction/i.test(question)) {
    insights = deductions;
  } else {
    insights = [
      {
        note: "General tax planning logic will be applied here"
      }
    ];
  }

  res.json({
    answer: "IRS logic engine (v1) executed successfully.",
    receivedQuestion: question,
    insights
  });
});

module.exports = router;
