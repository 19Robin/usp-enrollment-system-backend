// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Routes\profileRoutes.js
const express = require("express");
const { getStudentProfile,updateStudentProfile } = require("../Controller/studentProfileController");
const { getManagerProfile } = require("../Controller/managerProfileController");
const auth = require("../Middleware/JWT/authenticateJWT");
const router = express.Router();

// Define the route to get student profile
router.get("/profile", auth, getStudentProfile);
router.get("/manager-profile", auth, getManagerProfile);

router.put("/profile/:studentId", updateStudentProfile);

module.exports = router;