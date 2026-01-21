const express = require("express");
const cors = require("cors");

const app = express();

/**
 * --------------------
 * MIDDLEWARE
 * --------------------
 */
app.use(cors());
app.use(express.json());

/**
 * --------------------
 * HEALTH CHECK
 * --------------------
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "USA Tax AI Backend",
    environment: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString(),
  });
});

/**
 * --------------------
 * IRS RULE-BASED CORE (SAFE, NON-HALLUCINATED)
 * --------------------
 */
function irsRuleEngine(question) {
  const q = question.toLowerCase();

  if (q.includes("self employment tax")) {
    return (
      "In the United States, self-employment tax generally consists of Social Security and Medicare taxes. " +
      "You may reduce the taxable amount by deducting ordinary and necessary business expenses such as home office costs, " +
      "internet, phone, professional services, and a portion of health insurance premiums if eligible. " +
      "Refer to IRS Publication 334 and Publication 535 for official guidance."
    );
  }

  if (q.includes("llc") && q.includes("tax")) {
    return (
      "An LLC in the U.S. may be taxed as a sole proprietorship, partnership, or corporation depending on elections made. " +
      "Tax savings may be achieved through proper entity classification, expense deductions, and retirement contributions. " +
      "Refer to IRS Publication 3402 and Form 8832 for official rules."
    );
  }

  if (q.includes("deduction")) {
    return (
      "Common U.S. tax deductions include business expenses, retirement contributions, health savings accounts (HSA), " +
      "and certain education-related costs. Eligibility depends on income type and filing status. " +
      "Refer to IRS Publication 17 for detailed eligibility rules."
    );
  }

  return null;
}

/**
 * --------------------
 * ASK API (HYBRID ENGINE)
 * --------------------
 */
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      error: "Question is required",
    });
  }

  // 1️⃣ First try IRS rule engine (safe layer)
  const irsAnswer = irsRuleEngine(question);

  if (irsAnswer) {
    return res.json({
      source: "IRS_RULE_ENGINE",
      answer: irsAnswer,
      disclaimer:
        "This response is based on publicly available IRS publications and is not legal or tax advice.",
    });
  }

  // 2️⃣ Fallback (AI placeholder – next step)
  return res.json({
    source: "AI_FALLBACK",
    answer:
      "This question requires advanced analysis. AI-based reasoning will be enabled in the next update.",
    disclaimer:
      "This platform does not replace a licensed CPA or tax attorney.",
  });
});

/**
 * --------------------
 * 404 HANDLER
 * --------------------
 */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

module.exports = app;
