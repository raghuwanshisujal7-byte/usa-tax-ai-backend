function calculateAuditRisk(strategyName, income) {
  let score = 20; // base risk

  if (strategyName.includes("44ADA")) {
    score += 30;
  }

  if (strategyName.includes("Self Employment")) {
    score += 25;
  }

  if (income > 100000) {
    score += 15;
  }

  if (income > 250000) {
    score += 25;
  }

  if (score > 100) score = 100;

  return {
    score,
    level:
      score < 40
        ? "LOW"
        : score < 70
        ? "MEDIUM"
        : "HIGH"
  };
}

module.exports = { calculateAuditRisk };
