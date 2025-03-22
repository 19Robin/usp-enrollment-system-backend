// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Routes\programRoutes.js
const express = require("express");
const { getPrograms } = require("../Controller/programController");
const router = express.Router();

// Define the route to get programs
router.get("/programs", getPrograms);

module.exports = router;