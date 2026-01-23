// src/ai/predator.js

const irsRules = require("../irs/usaRules");
const auditRiskEngine = require("./riskEngine");

module.exports = function taxPredator(input) {
  const {
    income,
    type,
    filingStatus = "SINGLE",
    dependents = 0
  } = input;

  const taxpayerType = type.toUpperCase();
  const rules = irsRules[taxpayerType];

  if (!rules) {
    throw new Error(`No IRS rules found for taxpayer type: ${taxpayerType}`);
  }

  // --- Build strategies ---
  const strategies = Object.entries(rules).map(([key, rule]) => {
    return {
      key: key.toUpperCase(),
      strategy: rule.strategy,
      taxablePercent: rule.taxablePercent,
      taxableIncome: Math.round(income * rule.taxablePercent),
      source: rule.source,
      explanation: rule.explanation
    };
  });

  // --- Choose recommended strategy (BALANCED priority) ---
  const recommended =
    strategies.find(s => s.key === "BALANCED") || strategies[0];

  // --- Audit Risk ---
  const auditRisk = auditRiskEngine({
    income,
    strategy: recommended.key.toLowerCase()
  });

  return {
    country: "USA",
    status: "IRS_ENGINE_OK",
    taxpayerType,
    filingStatus,
    dependents,
    income,
    strategies,
    recommended,
    auditRisk,
    disclaimer:
      "This analysis is based on publicly available IRS laws and publications. Final filing should be reviewed by a licensed tax professional."
  };
};
