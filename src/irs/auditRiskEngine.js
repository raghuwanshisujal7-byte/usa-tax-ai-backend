/**
 * ======================================
 * AUDIT RISK ENGINE – DAY 3
 * ======================================
 * Calculates IRS audit risk based on:
 * - Income
 * - Deductions
 * - Presumptive taxation
 * - Expense ratio
 */

function calculateAuditRisk({
  income,
  netIncome,
  expenses = [],
  usedPresumptive
}) {
  let score = 0;
  const reasons = [];

  // High income → higher scrutiny
  if (income > 100000) {
    score += 20;
    reasons.push("High income bracket");
  }

  // Expense ratio check
  const totalExpenses = expenses.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );

  const expenseRatio = totalExpenses / income;

  if (expenseRatio > 0.5) {
    score += 30;
    reasons.push("Very high business expense ratio");
  } else if (expenseRatio > 0.3) {
    score += 15;
    reasons.push("Moderate business expense ratio");
  }

  // Presumptive taxation lowers audit risk
  if (usedPresumptive) {
    score -= 15;
    reasons.push("Presumptive taxation reduces audit complexity");
  }

  // Net income too low compared to gross
  if (netIncome < income * 0.4) {
    score += 20;
    reasons.push("Low net income compared to gross income");
  }

  // Normalize score
  score = Math.max(0, Math.min(score, 100));

  let level = "LOW";
  if (score >= 60) level = "HIGH";
  else if (score >= 30) level = "MEDIUM";

  return {
    score,
    level,
    reasons
  };
}

module.exports = { calculateAuditRisk };
