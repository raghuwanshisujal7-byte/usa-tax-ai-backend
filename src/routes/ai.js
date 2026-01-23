const express = require("express");
const router = express.Router();

// IMPORTANT: predator.js MUST export a function
const taxPredator = require("../ai/predator");

/**
 * POST /api/ai/analyze
 */
router.post("/analyze", (req, res) => {
  try {
    const input = req.body;

    // 1️⃣ Hard validation
    if (!input || Object.keys(input).length === 0) {
      return res.status(400).json({
        error: "Request body is empty",
      });
    }

    if (!input.income || !input.type) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["income", "type"],
      });
    }

    // 2️⃣ Default values (VERY IMPORTANT)
    const safeInput = {
      income: Num
