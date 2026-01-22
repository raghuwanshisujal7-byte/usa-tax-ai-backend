const express = require("express");
const router = express.Router();
const { taxPredator } = require("../ai");

router.post("/analyze", (req, res) => {
  const result = taxPredator(req.body);
  res.json(result);
});

module.exports = router;
