const express = require("express");
const router = express.Router();
// FIX: Use correct case for controller import
const { signup, login } = require("../controllers/AuthController");

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
