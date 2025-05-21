const User = require("../models/user");
const Tweet = require("../models/tweet");

exports.getUserProfile = async (req, res) => {
  try {
    const { username, userId } = req.params;
    let user;
    if (username) {
      user = await User.findOne({ username })
        .select("-password")
        .populate("followers", "username avatar")
        .populate("following", "username avatar");
    } else if (userId) {
      user = await User.findById(userId)
        .select("-password")
        .populate("followers", "username avatar")
        .populate("following", "username avatar");
    }
    if (!user) return res.status(404).json({ message: "User not found" });

    const tweets = await Tweet.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate("author", "username avatar");

    res.json({ user, tweets });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.followUser = async (req, res) => {
  try {
    const targetUsername = req.params.username;
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findOne({ username: targetUsername });

    if (!targetUser) return res.status(404).json({ message: "User not found" });
    if (targetUser._id.equals(currentUser._id)) return res.status(400).json({ message: "Cannot follow yourself" });

    if (!currentUser.following.includes(targetUser._id)) {
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
      await currentUser.save();
      await targetUser.save();
    }

    res.json({ message: "Followed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const targetUsername = req.params.username;
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findOne({ username: targetUsername });

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    currentUser.following = currentUser.following.filter(id => !id.equals(targetUser._id));
    targetUser.followers = targetUser.followers.filter(id => !id.equals(currentUser._id));

    await currentUser.save();
    await targetUser.save();

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
