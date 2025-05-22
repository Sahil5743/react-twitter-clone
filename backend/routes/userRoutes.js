const express = require('express');
const router = express.Router();
// FIX: Use lowercase filename for require path
const userController = require('../controllers/userController');
const authMiddleware = require("../middleware/AuthMiddleware");

router.post("/:username/follow", authMiddleware, userController.followUser);
router.post("/:username/unfollow", authMiddleware, userController.unfollowUser);
router.get('/:username', userController.getUserProfile);

module.exports = router;
