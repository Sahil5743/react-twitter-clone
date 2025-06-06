const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const tweetRoutes = require("./routes/tweetRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
// For local development, allow CORS from React dev server (port 3000)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

// Add a root route for browser GET /
app.get("/", (req, res) => {
  res.send("API is running. Use /api/ endpoints.");
});

const PORT = process.env.PORT || 5000;

// Remove deprecated options: useNewUrlParser, useUnifiedTopology
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => console.error("Local MongoDB error:", err));

module.exports = app;
