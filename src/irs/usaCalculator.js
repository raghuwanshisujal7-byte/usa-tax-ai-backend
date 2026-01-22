function calculatePresumptiveTax(income, taxablePercent) {
  return Math.round((income * taxablePercent) / 100);
}

function calculateDeduction(income, maxDeduction) {
  return Math.min(income, maxDeduction);
}

function calculateSelfEmploymentTax(income) {
  return Math.round((income * 15.3) / 100);
}

module.exports = {
  calculatePresumptiveTax,
  calculateDeduction,
  calculateSelfEmploymentTax
};
