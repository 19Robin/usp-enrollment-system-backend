// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Routes\programCourseRoutes.js
const express = require("express");
const { getProgramCourses } = require("../Controller/programCourseController");
const router = express.Router();

// Define the route to get program courses based on student ID
router.get("/program-courses",getProgramCourses);

module.exports = router;