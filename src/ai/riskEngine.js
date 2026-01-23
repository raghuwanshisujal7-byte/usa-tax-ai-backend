// src/ai/riskEngine.js

function calculateAuditRisk({ income, type, filingStatus, dependents, strategies }) {
  let score = 0;
  const flags = [];
  const whySafe = [];

  // Base income risk
  if (income > 100000) {
    score += 20;
    flags.push("High income bracket");
  } else {
    whySafe.push("Moderate income level");
  }

  // Freelancer / Schedule C risk
  if (type === "freelancer") {
    score += 15;
    flags.push("Self-employed (Schedule C filer)");
  }

  // Filing status
  if (filingStatus === "SINGLE") {
    score += 5;
    whySafe.push("Simple filing status");
  }

  // Dependents
  if (dependents === 0) {
    whySafe.push("No dependent-related credits claimed");
  } else {
    score += 10;
    flags.push("Dependent-related credits increase scrutiny");
  }

  // Strategy-based adjustments
  strategies.forEach((s) => {
    if (s.strategy.includes("44ADA")) {
      score -= 15;
      whySafe.push("Presumptive taxation reduces audit complexity");
    }

    if (s.strategy.toLowerCase().includes("standard deduction")) {
      score -= 10;
      whySafe.push("Standard deduction is low-risk and common");
    }

    if (s.strategy.toLowerCase().includes("business expense")) {
      score += 10;
      flags.push("Business expense claims may be reviewed");
    }
  });

  // Normalize score
  if (score < 5) score = 5;
  if (score > 95) score = 95;

  let level = "LOW";
  if (score >= 35 && score <= 65) level = "MEDIUM";
  if (score > 65) level = "HIGH";

  return {
    score,
    level,
    flags,
    whySafe,
    source: "IRS Audit Statistics & Publications",
  };
}

module.exports = {
  calculateAuditRisk,
};
