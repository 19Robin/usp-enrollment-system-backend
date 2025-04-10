const express = require("express");
const { getProgramByStudentId } = require("../Controller/programController");
const router = express.Router();

// Define the route to get the program name by student ID
router.get("/programs", getProgramByStudentId);

module.exports = router;