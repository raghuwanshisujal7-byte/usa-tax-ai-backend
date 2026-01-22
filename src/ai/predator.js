// src/ai/predator.js
function taxPredator(userData) {
  const income = Number(userData.income || 0);
  const type = userData.type || "individual";

  const suggestions = [];

  if (type === "freelancer" && income > 75000) {
    suggestions.push({
      strategy: "Presumptive Tax (44ADA)",
      benefit: "Lower tax + less compliance",
      risk: "Medium",
    });
  }

  if (income > 100000) {
    suggestions.push({
      strategy: "Retirement contribution",
      benefit: "Reduce taxable income",
      risk: "Low",
    });
  }

  return {
    message: "Tax Predator Engine Activated 🐅",
    suggestions,
  };
}

module.exports = { taxPredator };
