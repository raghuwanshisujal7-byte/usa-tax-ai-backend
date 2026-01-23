const usaRules = require("../irs/usaRules");
const riskEngine = require("./riskEngine");

module.exports = function taxPredator(input) {
  if (!input || !input.type) {
    throw new Error("Taxpayer type missing in input");
  }

  const taxpayerType = String(input.type).toUpperCase();

  console.log("TAXPAYER TYPE:", taxpayerType);
  console.log("AVAILABLE RULE KEYS:", Object.keys(usaRules));

  const rules = usaRules[taxpayerType];

  if (!rules || !Array.isArray(rules)) {
    throw new Error(`No IRS rules found for taxpayer type: ${taxpayerType}`);
  }

  const applicableRule = rules.find(
    rule => input.income <= rule.maxIncome
  );

  if (!applicableRule) {
    throw new Error("No applicable IRS rule matched for income");
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
