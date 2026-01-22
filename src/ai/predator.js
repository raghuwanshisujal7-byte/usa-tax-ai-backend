// Import USA IRS rule definitions
const usaRules = require("../irs/usaRules");

// Import calculation helpers
const {
  calculatePresumptiveTax,
  calculateDeduction,
  calculateSelfEmploymentTax
} = require("../irs/usaCalculator");

// Import audit risk engine
const { calculateAuditRisk } = require("./riskEngine");

function taxPredator(userData) {
  // Input normalization
  const income = Number(userData.income || 0);
  const type = (userData.type || "").toUpperCase();
  const filingStatus = userData.filingStatus || "SINGLE";

  let strategies = [];

  /**
   * ===============================
   * FREELANCER — PRESUMPTIVE TAX LOGIC
   * ===============================
   */
  if (type === "FREELANCER") {
    usaRules.FREELANCER.forEach(rule => {
      if (income <= rule.maxIncome) {
        const taxableIncome = calculatePresumptiveTax(
          income,
          rule.taxablePercent
        );

        strategies.push({
          strategy: rule.section,
          taxableIncome,
          auditRisk: calculateAuditRisk(rule.section, income),
          source: rule.source,
          explanation: rule.explanation
        });
      }
    });
  }

  /**
   * ===============================
   * STANDARD DEDUCTION (USA)
   * ===============================
   */
  const standardDeduction =
    usaRules.STANDARD_DEDUCTION[filingStatus] || 0;

  strategies.push({
    strategy: "Standard Deduction",
    amount: standardDeduction,
    auditRisk: { score: 5, level: "LOW" },
    source: usaRules.STANDARD_DEDUCTION.source,
    explanation: usaRules.STANDARD_DEDUCTION.explanation
  });

  /**
   * ===============================
   * SELF EMPLOYMENT TAX
   * ===============================
   */
  strategies.push({
    strategy: "Self Employment Tax",
    amount: calculateSelfEmploymentTax(income),
    auditRisk: calculateAuditRisk("Self Employment Tax", income),
    source: usaRules.SELF_EMPLOYMENT_TAX.source,
    explanation: usaRules.SELF_EMPLOYMENT_TAX.explanation
  });

  /**
   * ===============================
   * FINAL RESPONSE
   * ===============================
   */
  return {
    country: "USA",
    status: "IRS_ANALYSIS",
    income,
    taxpayerType: type,
    filingStatus,
    strategies,
    disclaimer:
      "This analysis is based on publicly available IRS laws and publications. Final filing should be reviewed by a licensed tax professional."
  };
}

module.exports = { taxPredator };
