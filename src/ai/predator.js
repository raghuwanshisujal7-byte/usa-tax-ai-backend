const usaRules = require("../irs/usaRules");
const {
  calculatePresumptiveTax,
  calculateDeduction,
  calculateSelfEmploymentTax,
} = require("../irs/usaCalculator");

module.exports = function taxPredator(input) {
  const income = Number(input.income);
  const type = input.type.toUpperCase();
  const filingStatus = input.filingStatus || "SINGLE";
  const dependents = input.dependents || 0;
  const expenses = input.expenses || [];

  // 🛑 Safety guard
  if (!usaRules[type]) {
    throw new Error(`No IRS rules found for taxpayer type: ${type}`);
  }

  const rules = usaRules[type];
  let strategies = [];
  let taxableIncome = income;

  // ==============================
  // 1️⃣ Presumptive Tax (IRC 44ADA)
  // ==============================
  if (rules.FREELANCER && rules.FREELANCER.length > 0) {
    const rule = rules.FREELANCER[0];

    if (rule.taxablePercent !== undefined) {
      taxableIncome = calculatePresumptiveTax(
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
  }

  // ==============================
  // 2️⃣ Standard Deduction
  // ==============================
  let standardDeduction = 0;
  if (rules.STANDARD_DEDUCTION) {
    standardDeduction =
      rules.STANDARD_DEDUCTION[filingStatus] || 0;

    strategies.push({
      strategy: "Standard Deduction",
      amount: standardDeduction,
      source: rules.STANDARD_DEDUCTION.source,
      applied: true,
    });
  }

  // ==============================
  // 3️⃣ Business Expenses
  // ==============================
  let totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  if (totalExpenses > 0) {
    strategies.push({
      strategy: "Business Expense Deduction (Schedule C)",
      totalExpenses,
      source: "IRS Schedule C",
      applied: true,
    });
  }

  // ==============================
  // 4️⃣ Self Employment Tax
  // ==============================
  const selfEmploymentTax =
    rules.SELF_EMPLOYMENT_TAX?.rate
      ? calculateSelfEmploymentTax(income)
      : 0;

  // ==============================
  // 5️⃣ Audit Risk Engine (simple v1)
  // ==============================
  let auditScore = 20;
  if (income > 100000) auditScore += 15;
  if (totalExpenses > income * 0.5) auditScore += 25;

  const auditRisk = {
    score: auditScore,
    level:
      auditScore < 30
        ? "LOW"
        : auditScore < 60
        ? "MEDIUM"
        : "HIGH",
  };

  // ==============================
  // FINAL RESPONSE
  // ==============================
  return {
    country: "USA",
    status: "IRS_AI_OK",
    taxpayerType: type,
    income,
    filingStatus,
    dependents,
    taxableIncome,
    standardDeduction,
    expenses: totalExpenses,
    selfEmploymentTax,
    auditRisk,
    strategies,
    disclaimer:
      "This analysis is based on publicly available IRS laws and publications. Final filing should be reviewed by a licensed tax professional.",
  };
};
