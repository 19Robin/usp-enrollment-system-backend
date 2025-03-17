// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Routes\authRoutes.js
const express = require("express");
const { addCourse } = require("../Controller/courseController");
const router = express.Router();

// Define the login route
router.post("/login", loginAttempt);

// Define the add course route
router.post("/courses", addCourse);

module.exports = router;