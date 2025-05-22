const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authMiddleware = require("../middleware/AuthMiddleware");



router.post("/:username/follow", authMiddleware, userController.followUser);
router.post("/:username/unfollow", authMiddleware, userController.unfollowUser);
router.get('/:username', userController.getUserProfile);


module.exports = router;
