// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Routes\authRoutes.js
const express = require("express");
const { loginAttempt } = require("../Controller/authController");
const authenticateUserJWT = require("../Middleware/JWT/authenticateJWT");
const router = express.Router();

// Define the login route
router.post("/login", loginAttempt);
router.get("/verify-token", authenticateUserJWT, (req, res) => {
  res.status(200).json({ valid: true, message: "Token is valid", user: req.user });
});
module.exports = router;