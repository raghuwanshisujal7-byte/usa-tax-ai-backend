/**
 * ======================================
 * AI TAX PREDATOR – DAY 3
 * ======================================
 * Final brain that returns:
 * - Final tax payable
 * - Tax saved
 * - Strategy explanation
 */

const { simulateTax } = require("../irs/taxSimulator");
const rules = require("../irs/usaRules");

function analyzeTax(payload) {
  const {
    income,
    type,
    expenses = [],
    filingStatus = "SINGLE"
  } = payload;

  // Run tax simulation
  const result = simulateTax({
    income,
    type,
    expenses,
    filingStatus
  });

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
    strategies,
    disclaimer:
      "This analysis is based on publicly available IRS laws and publications. Final filing should be reviewed by a licensed tax professional."
  };
}

module.exports = { analyzeTax };
