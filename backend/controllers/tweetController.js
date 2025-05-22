const Tweet = require("../models/Tweet");
const Notification = require("../models/NotificationModel");
const User = require("../models/User");

exports.createTweet = async (req, res) => {
  try {
    const tweet = new Tweet({
      content: req.body.content,
      author: req.user.id,
    });
    await tweet.save();
    const populatedTweet = await tweet.populate("author", "username avatar");
    res.status(201).json(populatedTweet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    const userId = req.user.id;
    const alreadyLiked = tweet.likes.includes(userId);

    if (alreadyLiked) {
      tweet.likes = tweet.likes.filter((id) => id.toString() !== userId);
    } else {
      tweet.likes.push(userId);
      // Notification for like
      if (tweet.author.toString() !== userId) {
        const newNotification = new Notification({
          user: tweet.author,
          sender: userId,
          type: "like",
          tweet: tweet._id
        });
        await newNotification.save();
      }
    }

    await tweet.save();
    res.json({ liked: !alreadyLiked, totalLikes: tweet.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find().populate('author', 'username avatar').sort({ createdAt: -1 });
    res.json(tweets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTimeline = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const followingIds = currentUser.following;

    // Get tweets from current user and followed users
    const tweets = await Tweet.find({
      author: { $in: [...followingIds, req.user.id] }
    })
      .sort({ createdAt: -1 })
      .populate("author", "username avatar");

    res.json({ tweets });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.replyToTweet = async (req, res) => {
  try {
    const { content } = req.body;
    const parentTweet = await Tweet.findById(req.params.id);

    if (!parentTweet) return res.status(404).json({ message: "Tweet not found" });

    const reply = new Tweet({
      author: req.user.id,
      content,
      parent: parentTweet._id,
    });

    await reply.save();
    // Notification for reply
    if (parentTweet.author.toString() !== req.user.id) {
      const newNotification = new Notification({
        user: parentTweet.author, // recipient
        sender: req.user.id, // the replier
        type: "reply",
        tweet: parentTweet._id
      });
      await newNotification.save();
    }

    const populatedReply = await reply.populate("author", "username avatar");

    res.status(201).json(populatedReply);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getReplies = async (req, res) => {
  try {
    const replies = await Tweet.find({ parent: req.params.id })
      .populate("author", "username avatar")
      .sort({ createdAt: 1 });

    res.json(replies);
  } catch (err) {
    res.status(500).json({ message: "Error fetching replies" });
  }
};

exports.editTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) return res.status(404).json({ message: "Tweet not found" });
    if (tweet.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    tweet.content = req.body.content || tweet.content;
    await tweet.save();

    const updatedTweet = await tweet.populate("author", "username avatar");
    res.json(updatedTweet);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) return res.status(404).json({ message: "Tweet not found" });
    if (tweet.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await tweet.deleteOne();
    res.json({ message: "Tweet deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
