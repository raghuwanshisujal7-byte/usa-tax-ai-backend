const express = require("express");
const router = express.Router();

/**
 * predator.js EK FUNCTION EXPORT karta hai
 * object nahi
 */
const taxPredator = require("../ai/predator");

/**
 * POST /api/ai/analyze
 */
router.post("/analyze", (req, res) => {
  try {
    const input = req.body;

    // 🛑 Safety check
    if (!input || typeof input !== "object" || Object.keys(input).length === 0) {
      return res.status(400).json({
        error: "Request body is empty or invalid",
      });
    }

    // 🧠 MAIN AI CALL
    const result = taxPredator(input);

    // ✅ Success response
    return res.json(result);

  } catch (error) {
    console.error("AI Analyze Error:", error);

    // ❌ Fail-safe response
    return res.status(500).json({
      error: "Internal AI Engine Error",
      message: error.message,
    });
  }
});

module.exports = router;
