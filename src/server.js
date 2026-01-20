const app = require("./app");

// Render ya local se PORT aayega
const PORT = process.env.PORT || 3000;

// Server start
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
