/**
 * ======================================
 * AI ROUTES – FINAL (DAY 3)
 * ======================================
 * Handles /api/ai/analyze
 */

const express = require("express");
const router = express.Router();

// ✅ IMPORTANT: correct import
const { analyzeTax } = require("../ai/predator");

// ===============================
// POST /api/ai/analyze
// ===============================
router.post("/analyze", (req, res) => {
  try {
    const payload = req.body;

    // Basic validation
    if (!payload || !payload.income || !payload.type) {
      return res.status(400).json({
        error: "Invalid request",
        message: "income and type are required"
      });
    }

    const result = analyzeTax(payload);
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
