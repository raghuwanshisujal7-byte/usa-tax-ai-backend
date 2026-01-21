const deductions = require("./deductions");
const credits = require("./credits");

function getIRSAnswer(question) {
  const q = question.toLowerCase();

  // 1️⃣ General tax saving
  if (q.includes("save tax") || q.includes("reduce tax")) {
    return {
      category: "general",
      answer: [
        ...deductions.basicDeductions,
        ...credits.basicCredits
      ]
    };
  }

  // 2️⃣ Deductions only
  if (q.includes("deduction")) {
    return {
      category: "deductions",
      answer: deductions.basicDeductions
    };
  }

  // 3️⃣ Credits only
  if (q.includes("credit")) {
    return {
      category: "credits",
      answer: credits.basicCredits
    };
  }

  // 4️⃣ Fallback
  return {
    category: "unknown",
    answer: [
      "Your question is valid, but IRS logic for this case is coming soon."
    ]
  };
}

module.exports = { getIRSAnswer };
