const usaRules = require("../irs/usaRules");

/**
 * Main Tax Brain (Day 4)
 */
function taxPredator(input) {
  const {
    income,
    type,
    filingStatus = "SINGLE",
    dependents = 0
  } = input;

  if (!income || !type) {
    throw new Error("Income and taxpayer type are required");
  }

  /* -------------------------------
     1. Filing Status Validation
  --------------------------------*/
  let finalFilingStatus = filingStatus;
  let filingReason = "User selected filing status";

  if (
    filingStatus === "HEAD_OF_HOUSEHOLD" &&
    dependents < usaRules.DEPENDENTS.HOH_MIN_DEPENDENTS
  ) {
    finalFilingStatus = "SINGLE";
    filingReason =
      "HOH requires at least one dependent (IRS Publication 501)";
  }

  const filingRule = usaRules.FILING_STATUS[finalFilingStatus];

  /* -------------------------------
     2. Standard Deduction
  --------------------------------*/
  const standardDeduction = filingRule.standardDeduction;

  /* -------------------------------
     3. Presumptive Tax (44ADA)
  --------------------------------*/
  let presumptiveTaxableIncome = null;
  let strategies = [];

  if (type === "freelancer") {
    presumptiveTaxableIncome = Math.round(
      income *
        (usaRules.FREELANCER.PRESUMPTIVE_TAX.taxablePercent / 100)
    );

    strategies.push({
      strategy: "IRC §44ADA (Presumptive Taxation)",
      taxableIncome: presumptiveTaxableIncome,
      benefit: "Lower compliance & simplified taxation",
      source: usaRules.FREELANCER.PRESUMPTIVE_TAX.source
    });
  }

  /* -------------------------------
     4. Audit Risk Engine (Day 4)
  --------------------------------*/
  let auditScore = 0;
  let auditReasons = [];

  if (income > 100000) {
    auditScore += 20;
    auditReasons.push("High income bracket");
  }

  if (finalFilingStatus === "HEAD_OF_HOUSEHOLD") {
    auditScore += 10;
    auditReasons.push("HOH filing status reviewed more strictly");
  }

  if (type === "freelancer") {
    auditScore += 15;
    auditReasons.push("Self-employed income");
  }

  let auditLevel = "LOW";
  if (auditScore >= 40) auditLevel = "MEDIUM";
  if (auditScore >= 70) auditLevel = "HIGH";

  /* -------------------------------
     5. Final Response
  --------------------------------*/
  return {
    country: "USA",
    status: "IRS_DAY_4_STEP_2_COMPLETE",
    income,
    taxpayerType: type.toUpperCase(),
    filingStatus: finalFilingStatus,
    filingReason,
    dependents,
    standardDeduction,
    presumptiveTaxableIncome,
    auditRisk: {
      score: auditScore,
      level: auditLevel,
      reasons: auditReasons
    },
    strategies,
    disclaimer:
      "This analysis is based on publicly available IRS laws and publications. Final filing should be reviewed by a licensed tax professional."
  };
}

module.exports = taxPredator;
