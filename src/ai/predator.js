const usaRules = require("../irs/usaRules");
const {
  calculatePresumptiveTax,
  calculateDeduction,
  calculateSelfEmploymentTax
} = require("../irs/usaCalculator");

const { calculateAuditRisk } = require("./riskEngine");

function taxPredator(userData) {
  const income = Number(userData.income || 0);
  const type = (userData.type || "").toUpperCase();
  const filingStatus = userData.filingStatus || "SINGLE";

  let strategies = [];

  // FREELANCER RULES (USA)
  if (type === "FREELANCER") {
    usaRules.FREELANCER.forEach(rule => {
      if (income <= rule.maxIncome) {
        const taxableIncome = calculatePresumptiveTax(
          income,
          rule.taxablePercent
        );

        const risk = calculateAuditRisk(rule.section, income);

        strategies.push({
          strategy: rule.section,
          taxableIncome,
          auditRisk: risk,
          source: rule.source,
          explanation: rule.explanation
        });
      }
    });
  }

  // STANDARD DEDUCTION
  const standardDeduction =
    usaRules.STANDARD_DEDUCTION[filingStatus] || 0;

  strategies.push({
    strategy: "Standard Deduction",
    amount: standardDeduction,
    auditRisk: { score: 5, level: "LOW" },
    source: usaRules.STANDARD_DEDUCTION.source,
    explanation: usaRules.STANDARD_DEDUCTION.explanation
  });

  // SELF EMPLOYMENT TAX
  const seTax = calculateSelfEmploymentTax(income);
  const seRisk = calculateAuditRisk("Self Employment Tax", income);

  strategies.push({
    strategy: "Self Employment Tax",
    amount: seTax,
    auditRisk: seRisk,
    source: usaRules.SELF_EMPLOYMENT_TAX.source,
    explanation: usaRules.SELF_EMPLOYMENT_TAX.explanation
  });

  return {
    country: "USA",
    status: "IRS_AUDIT_AWARE_ANALYSIS",
    income,
    taxpayerType: type,
    filingStatus,
    strategies,
    disclaimer:
      "This analysis is based on publicly available IRS laws and publications. Final filing should be reviewed by a licensed tax professional."
  };
}

module.exports = { taxPredator };
