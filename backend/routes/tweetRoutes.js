const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/tweetController');
// FIX: Use lowercase filename for require path
const authMiddleware = require('../middleware/authMiddleware');
const { replyToTweet, getReplies, editTweet, deleteTweet, getTimeline } = require("../controllers/tweetController");

// Edit tweet
router.put("/:id", authMiddleware, editTweet);
// Delete tweet
router.delete("/:id", authMiddleware, deleteTweet);
// Reply to tweet
router.post("/:id/reply", authMiddleware, replyToTweet);
// Get replies
router.get("/:id/replies", getReplies);
// Timeline
router.get("/timeline", authMiddleware, getTimeline);
// Create tweet
router.post('/', authMiddleware, tweetController.createTweet);
// Get all tweets
router.get('/', tweetController.getAllTweets);
// Like/unlike tweet
router.post('/:id/like', authMiddleware, tweetController.toggleLike);

module.exports = router;
