// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Routes\courseRoutes.js
const express = require("express");
const { getCourses } = require("../Controller/courseController");
const router = express.Router();

// Define the route to get courses
router.get("/courses", getCourses);

module.exports = router;