const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/TweetController');
const authMiddleware = require('../middleware/AuthMiddleware');
const { replyToTweet, getReplies, editTweet, deleteTweet, getTimeline } = require("../controllers/TweetController");

// Edit tweet
router.put("/:id", AuthMiddleware, editTweet);
// Delete tweet
router.delete("/:id", AuthMiddleware, deleteTweet);
// Reply to tweet
router.post("/:id/reply", AuthMiddleware, replyToTweet);
// Get replies
router.get("/:id/replies", getReplies);
// Timeline
router.get("/timeline", AuthMiddleware, getTimeline);
// Create tweet
router.post('/', AuthMiddleware, TweetController.createTweet);
// Get all tweets
router.get('/', TweetController.getAllTweets);
// Like/unlike tweet
router.post('/:id/like', AuthMiddleware, TweetController.toggleLike);

module.exports = router;
