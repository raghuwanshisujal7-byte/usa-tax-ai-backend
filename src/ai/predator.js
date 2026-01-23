const usaRules = require("../irs");

/**
 * TAX PREDATOR ENGINE (STABLE)
 * Input: { income, type, filingStatus, dependents }
 */
module.exports = function taxPredator(input) {
  const {
    income = 0,
    type,
    filingStatus = "SINGLE",
    dependents = 0,
  } = input;

  if (!type) {
    throw new Error("Taxpayer type is required");
  }

  const taxpayerType = type.toUpperCase();

  console.log("TAXPAYER TYPE:", taxpayerType);
  console.log("AVAILABLE RULE KEYS:", Object.keys(usaRules));

  const rules = usaRules[taxpayerType];

  // 🔒 SAFETY CHECK (NO MORE .find ERROR)
  if (!Array.isArray(rules)) {
    throw new Error(`No IRS rules found for taxpayer type: ${taxpayerType}`);
  }

  // For now: pick first valid rule (stable baseline)
  const rule = rules[0];

  if (!rule) {
    throw new Error(`IRS rule missing for taxpayer type: ${taxpayerType}`);
  }

  const taxableIncome =
    rule.taxablePercent && rule.maxIncome
      ? Math.min(income, rule.maxIncome) * (rule.taxablePercent / 100)
      : income;

  return {
    country: "USA",
    status: "IRS_ENGINE_OK",
    taxpayerType,
    filingStatus,
    dependents,
    income,

    breakdown: {
      presumptiveTaxableIncome: taxableIncome,
      selfEmploymentTax: Math.round(taxableIncome * 0.153),
    },

    auditRisk: {
      level: "LOW",
      score: 20,
      reasons: [
        "Presumptive taxation",
        "Single income source",
        "Standard IRS structure",
      ],
    },

    strategy: {
      section: rule.section,
      taxablePercent: rule.taxablePercent,
      maxIncome: rule.maxIncome,
      source: rule.source,
      explanation: rule.explanation,
    },

    disclaimer:
      "This analysis is based on publicly available IRS laws. Final filing should be reviewed by a licensed tax professional.",
  };
};
