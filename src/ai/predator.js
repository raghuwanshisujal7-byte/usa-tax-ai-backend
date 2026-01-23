const usaRules = require("../irs/usaRules");
const { calculatePresumptiveTax } = require("../irs/usaCalculator");

function taxPredator(input) {
  const {
    income = 0,
    type = "freelancer",
    filingStatus = "SINGLE",
    dependents = 0,
  } = input;

  const taxpayerType = type.toUpperCase();

  const rules = usaRules[taxpayerType];
  if (!rules || !Array.isArray(rules)) {
    throw new Error(`No IRS rules found for taxpayer type: ${taxpayerType}`);
  }

  // ✅ SAFE RULE PICK
  const presumptiveRule = rules.find(
    (r) => typeof r.taxablePercent === "number"
  );

  if (!presumptiveRule) {
    throw new Error("Presumptive tax rule not found");
  }

  const taxableIncome = calculatePresumptiveTax(
    income,
    presumptiveRule.taxablePercent
  );

  return {
    country: "USA",
    status: "IRS_DAY_4_RISK_ENGINE_READY",
    taxpayerType,
    income,
    filingStatus,
    dependents,
    strategy: {
      name: presumptiveRule.section,
      taxablePercent: presumptiveRule.taxablePercent,
      taxableIncome,
      source: presumptiveRule.source,
    },
    disclaimer:
      "This analysis is based on publicly available IRS laws. Final filing should be reviewed by a licensed tax professional.",
  };
}

module.exports = taxPredator;
