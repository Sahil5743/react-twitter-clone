const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const tweetRoutes = require("./routes/tweetRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Allow CORS from both React dev server (3000) and Vite dev server (5173)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173"
  ],
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

// Ensure backend listens on all interfaces for Docker/WSL/VM support
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    // Print full error for debugging
    console.error(err);
    process.exit(1);
  });

module.exports = app;
