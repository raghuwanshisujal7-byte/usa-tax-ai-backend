const express = require("express");
const router = express.Router();

router.post("/ask", (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    res.json({
      answer: "IRS logic coming soon. Backend is working perfectly.",
      receivedQuestion: question
    });

  } catch (err) {
    console.error("ASK ROUTE ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
