// ===============================
// AI TAX PREDATOR (USA)
// ===============================

const usaRules = require("../irs/usaRules");
const {
  calculatePresumptiveTax,
  calculateSelfEmploymentTax,
  calculateNetIncome
} = require("../irs/usaCalculator");

const { calculateAuditRisk } = require("./riskEngine");

function taxPredator(userData) {
  // -------------------------------
  // INPUT NORMALIZATION
  // -------------------------------
  const income = Number(userData.income || 0);
  const type = (userData.type || "").toUpperCase();
  const filingStatus = userData.filingStatus || "SINGLE";
  const expenses = userData.expenses || [];

  let strategies = [];

  // -------------------------------
  // FREELANCER – PRESUMPTIVE TAX
  // -------------------------------
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

  // -------------------------------
  // BUSINESS EXPENSES (Schedule C)
  // -------------------------------
  let netIncome = income;

  if (expenses.length > 0) {
    netIncome = calculateNetIncome(income, expenses);

    strategies.push({
      strategy: "Business Expense Deduction (Schedule C)",
      totalExpenses: income - netIncome,
      netIncome,
      auditRisk: { score: 30, level: "MEDIUM" },
      source: usaRules.BUSINESS_EXPENSES.source,
      explanation: usaRules.BUSINESS_EXPENSES.explanation
    });
  }

  // -------------------------------
  // STANDARD DEDUCTION
  // -------------------------------
  const standardDeduction =
    usaRules.STANDARD_DEDUCTION[filingStatus] || 0;

  strategies.push({
    strategy: "Standard Deduction",
    amount: standardDeduction,
    auditRisk: { score: 5, level: "LOW" },
    source: usaRules.STANDARD_DEDUCTION.source,
    explanation: usaRules.STANDARD_DEDUCTION.explanation
  });

  // -------------------------------
  // SELF EMPLOYMENT TAX
  // -------------------------------
  strategies.push({
    strategy: "Self Employment Tax",
    amount: calculateSelfEmploymentTax(netIncome),
    auditRisk: calculateAuditRisk("Self Employment Tax", netIncome),
    source: usaRules.SELF_EMPLOYMENT_TAX.source,
    explanation: usaRules.SELF_EMPLOYMENT_TAX.explanation
  });

  // -------------------------------
  // FINAL RESPONSE
  // -------------------------------
  return {
    country: "USA",
    status: "IRS_DAY_2_COMPLETE",
    income,
    netIncome,
    taxpayerType: type,
    filingStatus,
    strategies,
    disclaimer:
      "This analysis is based on publicly available IRS laws and publications. Final filing should be reviewed by a licensed tax professional."
  };
}

module.exports = { taxPredator };
