const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // The user receiving the notification
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // The user who performed the action (like/reply)
  },
  type: {
    type: String,
    enum: ["reply", "like", "follow"],
    required: true, // Can be extended to include other actions
  },
  tweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tweet",
    default: null, // Optional: Only required for like/reply
  },
  isRead: {
    type: Boolean,
    default: false, // Unread by default
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
