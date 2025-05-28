// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // <-- FIX: Remove accidental npm command

const connectDB = require('./config/db'); // ✅ Correct path for connectDB.js

// Route imports
const userRoutes = require("./routes/userRoutes");
const authRoutes = require('./routes/authRoutes');
const tweetRoutes = require('./routes/tweetRoutes');
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tweets', tweetRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

// Port for local dev
const PORT = process.env.PORT || 5000;

if (process.env.VERCEL) {
  // ✅ Vercel serverless export
  // Only require serverless-http if actually running on Vercel
  let handler;
  try {
    handler = require('serverless-http')(app);
  } catch (e) {
    console.error("serverless-http module not found. Please install it with: npm install serverless-http");
    process.exit(1);
  }

  module.exports = async (req, res) => {
    try {
      await connectDB();
      return handler(req, res);
    } catch (err) {
      console.error("Serverless handler error:", err);
      res.status(500).json({ error: "Database connection failed" });
    }
  };
} else {
  // ✅ Local development
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error("Local server error:", err);
    });

  module.exports = app;
}
