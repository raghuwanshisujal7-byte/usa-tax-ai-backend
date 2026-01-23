module.exports = {
  FILING_STATUS: {
    SINGLE: {
      standardDeduction: 14600,
      source: "IRS Publication 501"
    },
    MARRIED_FILING_JOINTLY: {
      standardDeduction: 29200,
      source: "IRS Publication 501"
    },
    HEAD_OF_HOUSEHOLD: {
      standardDeduction: 21900,
      source: "IRS Publication 501"
    }
  },

  FREELANCER: {
    PRESUMPTIVE_TAX: {
      section: "IRC §44ADA",
      taxablePercent: 50,
      source: "IRS Publication 334",
      explanation:
        "Eligible freelancers may declare 50% of gross receipts as taxable income under presumptive taxation."
    },

    SELF_EMPLOYMENT_TAX: {
      rate: 15.3,
      source: "IRS Publication 334",
      explanation:
        "Self-employed individuals must pay Social Security and Medicare tax on net earnings."
    }
  },

  DEPENDENTS: {
    HOH_MIN_DEPENDENTS: 1,
    source: "IRS Publication 501",
    explanation:
      "Head of Household filing status requires at least one qualifying dependent."
  }
};
