const deductions = require("./deductions");
const credits = require("./credits");

function getIRSAnswer(question) {
  const q = question.toLowerCase();

  if (q.includes("save tax") || q.includes("reduce tax")) {
    return {
      type: "general",
      answer: [
        ...deductions.basicDeductions,
        ...credits.basicCredits
      ]
    };
  }

  if (q.includes("deduction")) {
    return {
      type: "deductions",
      answer: deductions.basicDeductions
    };
  }

  if (q.includes("credit")) {
    return {
      type: "credits",
      answer: credits.basicCredits
    };
  }

  return {
    type: "unknown",
    answer: [
      "Please ask about IRS deductions, tax credits, or saving tax in the USA."
    ]
  };
}

module.exports = { getIRSAnswer };
