// src/ai/predator.js

const usaRules = require("../irs/usaRules");
const usaCalculator = require("../irs/usaCalculator");
const { calculateAuditRisk } = require("./riskEngine");

function taxPredatorEngine(payload) {
  const { income, type, filingStatus = "SINGLE", dependents = 0 } = payload;

  const strategies = [];

  // 44ADA Presumptive Taxation
  if (type === "freelancer" && income <= 500000) {
    const rule = usaRules.FREELANCER[0];
    const taxableIncome = usaCalculator.calculatePresumptiveTax(
      income,
      rule.taxablePercent
    );

    strategies.push({
      strategy: rule.section,
      taxableIncome,
      benefit: "Lower compliance & simplified taxation",
      source: rule.source,
      applied: true,
    });
  }

  // Standard Deduction
  const stdDeduction = usaRules.STANDARD_DEDUCTION[filingStatus];
  strategies.push({
    strategy: "Standard Deduction",
    amount: stdDeduction,
    source: usaRules.STANDARD_DEDUCTION.source,
    applied: true,
  });

  // Audit Risk Engine
  const auditRisk = calculateAuditRisk({
    income,
    type,
    filingStatus,
    dependents,
    strategies,
  });

  return {
    country: "USA",
    status: "IRS_DAY_4_STEP_3_COMPLETE",
    taxpayerType: type.toUpperCase(),
    income,
    filingStatus,
    dependents,
    strategies,
    auditRisk,
    disclaimer:
      "This analysis is based on publicly available IRS laws and publications. Final filing should be reviewed by a licensed tax professional.",
  };
}

module.exports = taxPredatorEngine;
