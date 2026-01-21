const express = require("express");
const cors = require("cors");

const irsRouter = require("./irs/router");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "USA Tax AI Backend",
    environment: "production",
    timestamp: new Date().toISOString()
  });
});

app.use("/", irsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = app;
