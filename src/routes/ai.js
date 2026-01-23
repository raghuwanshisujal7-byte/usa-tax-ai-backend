const express = require("express");
const router = express.Router();

// ✅ FIXED PATH (IMPORTANT)
const taxPredator = require("../ai/predator.js");

/**
 * POST /api/ai/analyze
 */
router.post("/analyze", (req, res) => {
  try {
    const input = req.body;

    if (!input || Object.keys(input).length === 0) {
      return res.status(400).json({
        error: "Request body is empty",
      });
    }

    // ✅ predator MUST be a function
    const result = taxPredator(input);

    return res.json(result);
  } catch (error) {
    console.error("AI Analyze Error:", error);

    return res.status(500).json({
      error: "Internal AI Engine Error",
      message: error.message,
    });
  }
});

module.exports = router;
