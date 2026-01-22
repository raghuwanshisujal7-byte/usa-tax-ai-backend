/**
 * ======================================
 * USA TAX CALCULATOR – DAY 3 FIXED
 * ======================================
 */

function calculatePresumptiveTax(income, taxablePercent) {
  return Math.round((income * taxablePercent) / 100);
}

function calculateSelfEmploymentTax(income) {
  return Math.round((income * 15.3) / 100);
}

function calculateNetIncome(income, expenses = []) {
  const totalExpenses = expenses.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  return Math.max(income - totalExpenses, 0);
}

module.exports = {
  calculatePresumptiveTax,
  calculateSelfEmploymentTax,
  calculateNetIncome
};
