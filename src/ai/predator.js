const usaRules = require("../irs/usaRules");
const {
  calculatePresumptiveTax,
  calculateSelfEmploymentTax,
} = require("../irs/usaCalculator");

function taxPredator(input) {
  const {
    income = 0,
    type = "freelancer",
    filingStatus = "SINGLE",
    dependents = 0,
  } = input;

  // 🔥 FIX: FORCE UPPERCASE (matches usaRules.js)
  const taxpayerType = String(type).toUpperCase();

  const rules = usaRules[taxpayerType];

  if (!rules || !Array.isArray(rules)) {
    throw new Error(`No IRS rules found for taxpayer type: ${taxpayerType}`);
  }

  const presumptiveRule = rules.find(
    (r) => typeof r.taxablePercent === "number"
  );

  if (!presumptiveRule) {
    throw new Error("Presumptive tax rule not found");
  }

  const presumptiveTaxableIncome = calculatePresumptiveTax(
    income,
    presumptiveRule.taxablePercent
  );

  const selfEmploymentTax = calculateSelfEmploymentTax(
    presumptiveTaxableIncome
  );

  return {
    country: "USA",
    status: "IRS_ENGINE_OK",
    taxpayerType,
    filingStatus,
    dependents,
    income,

    breakdown: {
      presumptiveTaxableIncome,
      selfEmploymentTax,
    },

    auditRisk: {
      level: "LOW",
      score: 25,
      reasons: [
        "Presumptive taxation",
        "Single income source",
        "Standard IRS reporting",
      ],
    },

    strategy: {
      section: presumptiveRule.section,
      taxablePercent: presumptiveRule.taxablePercent,
      source: presumptiveRule.source,
      explanation: presumptiveRule.explanation,
    },

    disclaimer:
      "This analysis is based on publicly available IRS laws. Final filing should be reviewed by a licensed tax professional.",
  };
}

module.exports = taxPredator;
