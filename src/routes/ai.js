const express = require("express");
const router = express.Router();
const taxPredator = require("../ai/predator");

router.post("/analyze", (req, res) => {
  try {
    const result = taxPredator(req.body);
    res.json(result);
  } catch (error) {
    console.error("AI Analyze Error:", error.message);
    res.status(500).json({
      error: "Internal AI Engine Error",
      message: error.message
    });
  }
});

module.exports = router;
