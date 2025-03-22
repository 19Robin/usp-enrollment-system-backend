// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Routes\authRoutes.js
const express = require("express");
const { loginAttempt } = require("../Controller/authController");
const router = express.Router();

// Define the login route
router.post("/login", loginAttempt);

module.exports = router;