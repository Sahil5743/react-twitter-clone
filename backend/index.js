const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const tweetRoutes = require("./routes/tweetRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

// --- MongoDB connection caching (important for Vercel) ---
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      console.log("Connected to MongoDB (serverless)");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// --- Serverless export ---
const handler = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (err) {
    console.error("Serverless handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = handler;

// --- Local dev support ---
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  mongoose.connect(process.env.MONGO_URI)
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch((err) => console.error("Local MongoDB error:", err));
}
