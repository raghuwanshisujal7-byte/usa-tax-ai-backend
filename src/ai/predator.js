// src/ai/predator.js

const irsRules = require("../irs/rules");
const riskEngine = require("./riskEngine");

function normalizeType(type) {
  return String(type || "").trim().toUpperCase();
}

module.exports = function taxPredator(input) {
  if (!input || !input.type || !input.income) {
    throw new Error("Invalid input for tax analysis");
  }

  const taxpayerType = normalizeType(input.type);
  const income = Number(input.income);
  const filingStatus = input.filingStatus || "SINGLE";
  const dependents = Number(input.dependents || 0);

  const rules = irsRules[taxpayerType];
  if (!rules) {
    throw new Error(`No IRS rules found for taxpayer type: ${taxpayerType}`);
  }

  // ================================
  // STRATEGY 1: SAFE
  // ================================
  const safeStrategy = {
    name: "SAFE",
    strategy: rules.safe.strategy,
    taxableIncome: income * rules.safe.taxablePercent,
    taxablePercent: rules.safe.taxablePercent * 100,
    source: rules.safe.source,
    explanation: rules.safe.explanation
  };

  // ================================
  // STRATEGY 2: BALANCED
  // ================================
  const balancedStrategy = {
    name: "BALANCED",
    strategy: rules.balanced.strategy,
    taxableIncome: income * rules.balanced.taxablePercent,
    taxablePercent: rules.balanced.taxablePercent * 100,
    source: rules.balanced.source,
    explanation: rules.balanced.explanation
  };

  // ================================
  // STRATEGY 3: AGGRESSIVE
  // ================================
  const aggressiveStrategy = {
    name: "AGGRESSIVE",
    strategy: rules.aggressive.strategy,
    taxableIncome: income * rules.aggressive.taxablePercent,
    taxablePercent: rules.aggressive.taxablePercent * 100,
    source: rules.aggressive.source,
    explanation: rules.aggressive.explanation,
    warning: "Higher audit risk. Documentation required."
  };

  const strategies = [safeStrategy, balancedStrategy, aggressiveStrategy];

  const auditRisk = riskEngine({
    income,
    taxpayerType,
    strategies
  });

  return {
    country: "USA",
    status: "IRS_ENGINE_OK",
    taxpayerType,
    filingStatus,
    dependents,
    income,
    strategies,
    recommended: balancedStrategy.name,
    auditRisk,
    disclaimer:
      "This analysis is based on publicly available IRS laws. Final filing should be reviewed by a licensed tax professional."
  };
};
