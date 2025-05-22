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

// API Routes
app.use('/api/auth', AuthRoutes);
app.use('/api/tweets', TweetRoutes);
app.use("/api/notifications", NotificationRoutes);
app.use("/api/users", UserRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.error(err));
