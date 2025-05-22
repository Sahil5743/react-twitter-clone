const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require("../middleware/authMiddleware");



router.post("/:username/follow", authMiddleware, userController.followUser);
router.post("/:username/unfollow", authMiddleware, userController.unfollowUser);
router.get('/:username', userController.getUserProfile);


module.exports = router;
