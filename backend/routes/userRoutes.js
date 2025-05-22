const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authMiddleware = require("../middleware/AuthMiddleware");

router.post("/:username/follow", authMiddleware, UserController.followUser);
router.post("/:username/unfollow", authMiddleware, UserController.unfollowUser);
router.get('/:username', UserController.getUserProfile);

module.exports = router;
