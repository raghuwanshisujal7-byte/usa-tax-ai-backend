const express = require("express");
const router = express.Router();

// ✅ CORRECT IMPORT
const { analyzeTax } = require("../ai/predator");

// ✅ CORRECT ROUTE HANDLER
router.post("/analyze", (req, res) => {
  try {
    const result = analyzeTax(req.body);
    res.json(result);
  } catch (error) {
    console.error("AI Analyze Error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
});

module.exports = router;
