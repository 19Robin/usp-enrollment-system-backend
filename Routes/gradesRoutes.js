const express = require("express");
const { getCompletedCourses } = require("../Controller/gradesController");
const router = express.Router();

// Define the route to get completed courses
router.get("/completed-courses", getCompletedCourses);

module.exports = router;