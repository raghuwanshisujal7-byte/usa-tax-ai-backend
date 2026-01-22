/**
 * ===============================
 * USA TAX CALCULATION ENGINE
 * ===============================
 * All calculations are based on
 * publicly available IRS rules
 */

/**
 * Presumptive Tax (IRC §44ADA style logic)
 * Only a percentage of income is treated as taxable
 */
function calculatePresumptiveTax(income, taxablePercent) {
  return Math.round((income * taxablePercent) / 100);
}

/**
 * Deduction helper (caps deduction to max allowed)
 */
function calculateDeduction(income, maxDeduction) {
  return Math.min(income, maxDeduction);
}

/**
 * Self Employment Tax
 * Social Security + Medicare = 15.3%
 */
function calculateSelfEmploymentTax(income) {
  return Math.round((income * 15.3) / 100);
}

/**
 * Net Income after Business Expenses (Schedule C)
 */
function calculateNetIncome(income, expenses = []) {
  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );

  return Math.max(income - totalExpenses, 0);
}

module.exports = {
  calculatePresumptiveTax,
  calculateDeduction,
  calculateSelfEmploymentTax,
  calculateNetIncome
};
