// src/ai/riskEngine.js

module.exports = function riskEngine({ income, taxpayerType, strategies }) {
  let score = 0;
  let reasons = [];

  if (income > 100000) {
    score += 15;
    reasons.push("High income bracket");
  }

  const aggressive = strategies.find(s => s.name === "AGGRESSIVE");
  if (aggressive) {
    score += 20;
    reasons.push("Aggressive tax strategy selected");
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
