const deductions = require("./deductions");
const credits = require("./credits");

/**
 * Core IRS Logic Brain
 * This function decides which IRS data to return
 */
function getIRSAnswer(question) {
  if (!question || typeof question !== "string") {
    return {
      category: "error",
      answer: "Invalid question format"
    };
  }

  const q = question.toLowerCase();

  // 👉 DEDUCTIONS
  if (q.includes("deduction")) {
    return {
      category: "deductions",
      answer: deductions.basicDeductions
    };
  }

  // 👉 CREDITS
  if (q.includes("credit")) {
    return {
      category: "credits",
      answer: credits.basicCredits
    };
  }

  // 👉 GENERIC TAX SAVING
  if (q.includes("save tax") || q.includes("reduce tax")) {
    return {
      category: "general",
      answer: [
        ...deductions.basicDeductions,
        ...credits.basicCredits
      ]
    };
  }

  // 👉 FALLBACK
  return {
    category: "unknown",
    answer: "IRS logic is live. Please ask about deductions or credits."
  };
}

module.exports = {
  getIRSAnswer
};
