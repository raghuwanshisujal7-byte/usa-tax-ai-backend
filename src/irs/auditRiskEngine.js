/**
 * AUDIT RISK ENGINE
 * ----------------
 * Returns audit risk score & level
 * Must EXPORT A FUNCTION (important)
 */

module.exports = function auditRiskEngine({
  income,
  taxpayerType,
  filingStatus,
  dependents,
  strategy,
}) {
  let score = 0;
  const reasons = [];

  // High income risk
  if (income > 100000) {
    score += 10;
    reasons.push("High income bracket");
  }

  // Freelancer / self-employed risk
  if (taxpayerType === "FREELANCER") {
    score += 5;
    reasons.push("Self-employed income");
  }

  // Presumptive taxation reduces audit risk
  if (strategy && strategy.toUpperCase().includes("PRESUMPTIVE")) {
    score -= 5;
    reasons.push("Presumptive taxation reduces audit complexity");
  }

  // Dependents slightly reduce risk
  if (dependents > 0) {
    score -= 2;
    reasons.push("Dependents declared");
  }

  let level = "LOW";
  if (score >= 25) level = "HIGH";
  else if (score >= 15) level = "MEDIUM";

  return {
    score,
    level,
    reasons,
  };
};
