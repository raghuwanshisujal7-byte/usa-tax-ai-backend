// src/ai/predator.js

const usaRules = require("../irs/usaRules");
const riskEngine = require("./riskEngine");

module.exports = function taxPredator(input) {
  if (!input || !input.type) {
    throw new Error("Invalid input");
  }

  const taxpayerType = input.type.toUpperCase();
  const rulesForType = usaRules[taxpayerType];

  if (!Array.isArray(rulesForType)) {
    throw new Error(`No IRS rules found for taxpayer type: ${taxpayerType}`);
  }

  const strategy = rulesForType.find(rule => {
    if (!rule.maxIncome) return true;
    return input.income <= rule.maxIncome;
  });

  if (!strategy) {
    throw new Error("No matching tax strategy found");
  }

  const auditRisk = riskEngine({
    income: input.income,
    taxpayerType,
    strategy
  });

  return {
    country: "USA",
    status: "IRS_ENGINE_OK",
    taxpayerType,
    filingStatus: input.filingStatus,
    dependents: input.dependents || 0,
    income: input.income,

    breakdown: {
      presumptiveTaxableIncome:
        input.income * (strategy.taxablePercent / 100),
      selfEmploymentTax:
        Math.round(input.income * 0.153 * 0.5)
    },

    auditRisk,

    strategy: {
      section: strategy.section,
      taxablePercent: strategy.taxablePercent,
      maxIncome: strategy.maxIncome,
      source: strategy.source,
      explanation: strategy.explanation
    },

    disclaimer:
      "This analysis is based on publicly available IRS laws. Final filing should be reviewed by a licensed tax professional."
  };
};
