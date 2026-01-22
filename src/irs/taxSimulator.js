/**
 * ======================================
 * TAX SIMULATOR – DAY 3 CORE ENGINE
 * ======================================
 * Compares tax with and without planning
 */

const rules = require("./usaRules");
const {
  calculatePresumptiveTax,
  calculateSelfEmploymentTax,
  calculateNetIncome
} = require("./usaCalculator");

function simulateTax({ income, type, expenses = [], filingStatus = "SINGLE" }) {
  // ---------- WITHOUT PLANNING ----------
  const rawSelfEmploymentTax = calculateSelfEmploymentTax(income);

  // ---------- WITH PLANNING ----------
  const netIncome = calculateNetIncome(income, expenses);

  // Presumptive tax (if applicable)
  let presumptiveTaxableIncome = null;
  let presumptiveTax = null;

  if (type === "freelancer" && rules.FREELANCER?.length) {
    const rule = rules.FREELANCER[0];
    presumptiveTaxableIncome = calculatePresumptiveTax(
      income,
      rule.taxablePercent
    );
    presumptiveTax = calculateSelfEmploymentTax(presumptiveTaxableIncome);
  }

  // Standard deduction
  const standardDeduction =
    rules.STANDARD_DEDUCTION?.[filingStatus] || 0;

  const taxableAfterDeduction = Math.max(
    netIncome - standardDeduction,
    0
  );

  const plannedSelfEmploymentTax =
    calculateSelfEmploymentTax(taxableAfterDeduction);

  // Choose best (lowest legal tax)
  const bestPlannedTax = Math.min(
    plannedSelfEmploymentTax,
    presumptiveTax || plannedSelfEmploymentTax
  );

  return {
    withoutPlanning: rawSelfEmploymentTax,
    withPlanning: bestPlannedTax,
    taxSaved: rawSelfEmploymentTax - bestPlannedTax,
    breakdown: {
      netIncome,
      standardDeduction,
      presumptiveTaxableIncome
    }
  };
}

module.exports = { simulateTax };
