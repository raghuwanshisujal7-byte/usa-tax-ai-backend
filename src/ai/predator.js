/**
 * AI TAX PREDATOR ENGINE
 * ---------------------
 * - Determines IRS strategy based on taxpayer type & income
 * - Safe against undefined rules, empty arrays, and find() crashes
 */

const irsRules = require("../irs/usaRules");
const auditRiskEngine = require("../irs/auditRiskEngine");

module.exports = function taxPredator(input) {
  if (!input) {
    throw new Error("Input payload missing");
  }

  const {
    income,
    type,
    filingStatus = "SINGLE",
    dependents = 0,
  } = input;

  if (!income || !type) {
    throw new Error("Income or taxpayer type missing");
  }

  const taxpayerType = String(type).toUpperCase();

  // -------------------------------
  // STEP 1: LOAD IRS RULES
  // -------------------------------
  const rules = irsRules[taxpayerType];

  if (!Array.isArray(rules)) {
    throw new Error(
      `No IRS rules found for taxpayer type: ${taxpayerType}`
    );
  }

  // -------------------------------
  // STEP 2: SELECT APPLICABLE RULE
  // -------------------------------
  const rule = rules.find(r => {
    if (!r) return false;
    if (typeof r.maxIncome !== "number") return true;
    return income <= r.maxIncome;
  });

  if (!rule) {
    throw new Error(
      `No applicable IRS rule found for income ${income}`
    );
  }

  // -------------------------------
  // STEP 3: TAX CALCULATION
  // -------------------------------
  const taxableIncome =
    rule.taxablePercent
      ? Math.round((income * rule.taxablePercent) / 100)
      : income;

  const selfEmploymentTax = Math.round(taxableIncome * 0.153); // 15.3%

  // -------------------------------
  // STEP 4: AUDIT RISK ENGINE
  // -------------------------------
  const auditRisk = auditRiskEngine({
    income,
    taxpayerType,
    filingStatus,
    dependents,
    strategy: rule.section,
  });

  // -------------------------------
  // FINAL RESPONSE
  // -------------------------------
  return {
    country: "USA",
    status: "IRS_ENGINE_OK",
    taxpayerType,
    filingStatus,
    dependents,
    income,

    breakdown: {
      presumptiveTaxableIncome: taxableIncome,
      selfEmploymentTax,
    },

    auditRisk,

    strategy: {
      section: rule.section,
      taxablePercent: rule.taxablePercent,
      maxIncome: rule.maxIncome,
      source: rule.source,
      explanation: rule.explanation,
    },

    disclaimer:
      "This analysis is based on publicly available IRS laws and publications. Final filing should be reviewed by a licensed tax professional.",
  };
};
