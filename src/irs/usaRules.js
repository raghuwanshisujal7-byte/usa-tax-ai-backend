// src/irs/usaRules.js

module.exports = {
  FREELANCER: {
    safe: {
      strategy: "Standard Deduction + Schedule C",
      taxablePercent: 0.7,
      source: "IRS Publication 334",
      explanation:
        "Conservative approach using standard deduction and limited expense claims."
    },

    balanced: {
      strategy: "IRC §44ADA (Presumptive Taxation)",
      taxablePercent: 0.5,
      source: "IRS Publication 334",
      explanation:
        "Eligible self-employed professionals may declare 50% of gross receipts as taxable income."
    },

    aggressive: {
      strategy: "Maximum Business Expense Optimization",
      taxablePercent: 0.35,
      source: "IRS Publication 535",
      explanation:
        "Aggressively deducts business expenses. Requires strong documentation.",
    }
  }
};
