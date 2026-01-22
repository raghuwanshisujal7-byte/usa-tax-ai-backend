module.exports = {
  // ===============================
  // FREELANCER – PRESUMPTIVE TAX
  // ===============================
  FREELANCER: [
    {
      section: "IRC §44ADA (Presumptive Income)",
      maxIncome: 500000,
      taxablePercent: 50,
      source: "IRS Publication 334",
      explanation:
        "Eligible professionals may declare 50% of gross receipts as taxable income under presumptive taxation."
    }
  ],

  // ===============================
  // STANDARD DEDUCTION (USA)
  // ===============================
  STANDARD_DEDUCTION: {
    SINGLE: 14600,
    MARRIED: 29200,
    source: "IRS Publication 501",
    explanation:
      "Standard deduction reduces taxable income when itemized deductions are not claimed."
  },

  // ===============================
  // SELF EMPLOYMENT TAX
  // ===============================
  SELF_EMPLOYMENT_TAX: {
    rate: 15.3,
    source: "IRS Publication 334",
    explanation:
      "Self-employed individuals must pay Social Security and Medicare tax on net earnings."
  },

  // ===============================
  // BUSINESS EXPENSES (Schedule C)
  // ===============================
  BUSINESS_EXPENSES: {
    categories: [
      "Home Office",
      "Internet & Phone",
      "Software Subscriptions",
      "Travel & Meals",
      "Office Supplies",
      "Professional Services"
    ],
    source: "IRS Schedule C & Pub 535",
    explanation:
      "Ordinary and necessary business expenses are deductible under IRS Schedule C."
  }
};
