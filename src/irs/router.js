const deductions = require("../deductions");
const credits = require("./credits");

function getIRSAnswer(question) {
  if (!question) {
    return {
      answer: "Please provide a valid question."
    };
  }

  const q = question.toLowerCase();

  if (q.includes("deduction")) {
    return {
      answer: deductions.basicDeductions
    };
  }

  if (q.includes("credit")) {
    return {
      answer: credits.basicCredits
    };
  }

  if (q.includes("save tax") || q.includes("reduce tax")) {
    return {
      answer: [
        ...deductions.basicDeductions,
        ...credits.basicCredits
      ]
    };
  }

  return {
    answer: "IRS logic coming soon. Backend is working perfectly."
  };
}

module.exports = getIRSAnswer;
