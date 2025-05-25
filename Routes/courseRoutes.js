const express = require("express");
const { getCourses, registerCourse, getActiveRegistrations, getDroppedRegistrations, getCoursePrerequisites } = require("../Controller/courseController");
const router = express.Router();
const holdCheck = require("../Middleware/holdCheck");

// Define the route to get courses
router.get("/courses", getCourses);

// Define the route to get program courses with prerequisites
router.get("/course-prerequisites", getCoursePrerequisites);

// Define the route to register a course
router.post("/registerCourse", registerCourse);

// Define the route to get active registrations
router.get("/active-registrations", holdCheck('registration'),getActiveRegistrations);

// Define the route to get dropped registrations
router.get("/dropped-registrations", getDroppedRegistrations);

module.exports = router;