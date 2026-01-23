const express = require("express");
const router = express.Router();

/**
 * IMPORTANT:
 * predator.js exports a FUNCTION (not object)
 */
const taxPredator = require("../ai/predator");

/**
 * POST /api/ai/analyze
 */
router.post("/analyze", (req, res) => {
  try {
    const input = req.body;

    if (!input || Object.keys(input).length === 0) {
      return res.status(400).json({
        error: "Request body is empty"
      });
    }

    const result = taxPredator(input);

    return res.json(result);
  } catch (error) {
    console.error("AI Analyze Error:", error.message);

    return res.status(500).json({
      error: "Internal AI Engine Error",
      message: error.message
    });
  }
});

module.exports = router;
