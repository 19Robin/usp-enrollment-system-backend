const express = require("express");
const {getCompletedCourses, getCourseDetails, submitGradeRecheckApplication, checkApplication} = require("../Controller/gradesController");
const router = express.Router();
const auth = require("../Middleware/JWT/authenticateJWT");

// Define the route to get completed courses
router.get("/completed-courses", getCompletedCourses);
router.get('/course-details/:studentId/:courseCode', getCourseDetails);
router.post('/submit-recheck', submitGradeRecheckApplication);
router.get('/check/:studentId/:courseCode/:term', checkApplication);

module.exports = router;