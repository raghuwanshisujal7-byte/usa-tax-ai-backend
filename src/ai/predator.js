const usaRules = require("../irs/usaRules");
const riskEngine = require("./riskEngine");

module.exports = function taxPredator(input) {
  const taxpayerType = input.type?.toUpperCase();

  if (!taxpayerType) {
    throw new Error("Taxpayer type missing");
  }

  const rules = usaRules[taxpayerType];

  if (!Array.isArray(rules)) {
    throw new Error(`No IRS rules found for taxpayer type: ${taxpayerType}`);
  }

  const applicableRule = rules.find(rule => {
    return input.income <= rule.maxIncome;
  });

  if (!applicableRule) {
    throw new Error("No applicable IRS rule matched");
  }

  const taxableIncome =
    (input.income * applicableRule.taxablePercent) / 100;

  const auditRisk = riskEngine({
    income: input.income,
    type: taxpayerType
  });

  return {
    country: "USA",
    status: "IRS_ENGINE_OK",
    taxpayerType,
    filingStatus: input.filingStatus,
    dependents: input.dependents || 0,
    income: input.income,

    breakdown: {
      presumptiveTaxableIncome: taxableIncome
    },

    strategy: {
      section: applicableRule.section,
      taxablePercent: applicableRule.taxablePercent,
      maxIncome: applicableRule.maxIncome,
      source: applicableRule.source,
      explanation: applicableRule.explanation
    },

    auditRisk,
    disclaimer:
      "This analysis is based on publicly available IRS laws. Final filing should be reviewed by a licensed tax professional."
  };
};
