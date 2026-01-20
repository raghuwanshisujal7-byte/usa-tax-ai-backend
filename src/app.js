const express = require("express");
const cors = require("cors");

const app = express();

// --------- Middlewares ----------
app.use(cors());
app.use(express.json());

// --------- Routes ----------
app.get("/", (req, res) => {
  res.json({
    message: "USA Tax AI Backend running",
    status: "ok"
  });
});

module.exports = app;
