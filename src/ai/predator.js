/**
 * ======================================
 * AI TAX PREDATOR – DAY 3 (FINAL)
 * ======================================
 * Returns:
 * - Final tax payable
 * - Tax saved
 * - WITH vs WITHOUT planning
 * - Audit risk score
 * - IRS-safe explanations
 */

const { simulateTax } = require("../irs/taxSimulator");
const rules = require("../irs/usaRules");
const { calculateAuditRisk } = require("../irs/auditRiskEngine");

function analyzeTax(payload) {
  const {
    income,
    type,
    expenses = [],
    filingStatus = "SINGLE"
  } = payload;

  // ===============================
  // TAX SIMULATION
  // ===============================
  const result = simulateTax({
    income,
    type,
    expenses,
    filingStatus
  });

  // ===============================
  // AUDIT RISK CALCULATION
  // ===============================
  const auditRisk = calculateAuditRisk({
    income,
    netIncome: result.breakdown.netIncome,
    expenses,
    usedPresumptive: result.breakdown.presumptiveTaxableIncome !== null
  });

  // ===============================
  // STRATEGY EXPLANATION
  // ===============================
  const strategies = [];

  if (type === "freelancer") {
    strategies.push({
      strategy: "IRC §44ADA (Presumptive Taxation)",
      benefit: "Lower compliance & simplified taxation",
      source: "IRS Publication 334",
      applied: result.breakdown.presumptiveTaxableIncome !== null
    });
  }

  if (rules.STANDARD_DEDUCTION?.[filingStatus]) {
    strategies.push({
      strategy: "Standard Deduction",
      benefit: `Deduction of $${rules.STANDARD_DEDUCTION[filingStatus]}`,
      source: "IRS Publication 501",
      applied: true
    });
  }

  if (expenses.length > 0) {
    strategies.push({
      strategy: "Business Expense Deduction (Schedule C)",
      benefit: "Reduces net taxable income",
      source: "IRS Schedule C",
      applied: true
    });
  }

  // ===============================
  // FINAL RESPONSE
  // ===============================
  return {
    country: "USA",
    status: "IRS_DAY_3_COMPLETE",
    taxpayerType: type.toUpperCase(),
    income,
    filingStatus,

    comparison: {
      withoutPlanning: result.withoutPlanning,
      withPlanning: result.withPlanning
    },

    finalTaxPayable: result.withPlanning,
    taxSaved: result.taxSaved,

    breakdown: result.breakdown,
    auditRisk,
    strategies,

    disclaimer:
      "This analysis is based on publicly available IRS laws and publications. Final filing should be reviewed by a licensed tax professional."
  };
}

module.exports = { analyzeTax };
