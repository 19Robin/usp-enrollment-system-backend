const express = require("express");
const { loginAttempt } = require("../Controller/authController");
const router = express.Router();

// Define the login route
router.post("/login", loginAttempt);

module.exports = router;