const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require("./routes/userRoutes");
const authRoutes = require('./routes/authRoutes');
const tweetRoutes = require('./routes/tweetRoutes');
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Vercel/Serverless: Add a health check endpoint to keep the server "warm"
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tweets', tweetRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

// For Vercel: Export the app for serverless
module.exports = app;

// For Vercel: Connect to MongoDB on every invocation if not already connected
if (process.env.VERCEL) {
  let isConnected = false;
  app.use(async (req, res, next) => {
    if (!isConnected) {
      try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
      } catch (err) {
        console.error("MongoDB connection error:", err);
        return res.status(500).json({ error: "MongoDB connection failed" });
      }
    }
    next();
  });
} else if (require.main === module) {
  // For local/dev: Start server if not in serverless
  mongoose.connect(process.env.MONGO_URI)
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch(err => console.error(err));
}

// ---
// To reduce sleep on Vercel, use a free uptime monitor (like UptimeRobot) to ping
// https://<your-vercel-domain>/api/health every 5-10 minutes.
// This keeps the serverless function "warm" and responsive.
