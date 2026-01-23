// src/ai/riskEngine.js

module.exports = function riskEngine({ income, taxpayerType, strategy }) {
  let score = 0;
  let reasons = [];

  if (income > 100000) {
    score += 10;
    reasons.push("High income bracket");
  }

  if (taxpayerType === "FREELANCER") {
    score += 5;
    reasons.push("Self-employed income");
  }

  if (strategy?.section?.includes("Presumptive")) {
    score -= 10;
    reasons.push("Presumptive taxation reduces audit complexity");
  }

  let level = "LOW";
  if (score >= 30) level = "MEDIUM";
  if (score >= 50) level = "HIGH";

  return {
    score,
    level,
    reasons
  };
};
