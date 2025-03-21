const express = require("express");
const router = express.Router();
const Grade = require("../Model/Grade"); // Assuming you have a Grade model

// Fetch grades for a student
router.get("/student/:studentID/grades", async (req, res) => {
    try {
        const studentID = req.params.studentID;
        const grades = await Grade.find({ studentID }); // Fetch grades from the database
        res.json(grades);
    } catch (error) {
        console.error("Error fetching grades:", error);
        res.status(500).json({ message: "Error fetching grades" });
    }
});

module.exports = router;