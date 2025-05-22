const express = require("express");
const router = express.Router();
const { getNotifications } = require("../controllers/NotificationController");
const authMiddleware = require("../middleware/AuthMiddleware");

router.get("/", AuthMiddleware, getNotifications);

module.exports = router;
