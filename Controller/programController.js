// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Controller\programController.js
const { getPrograms } = require('../Model/programModel');
const AppError = require("../appError");

const getProgramsHandler = async (req, res, next) => {
  try {
    const programs = await new Promise((resolve, reject) => {
      getPrograms((err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    //res.status(500).json({ details: { message: "An Unexpected Error Occurred" } });
    next(new AppError("DB_ERROR", "Error fetching programs", 500)); // Pass the error to the error middleware
  }

  const query = `
    SELECT p.program_name
    FROM programs p
    JOIN students s ON p.program_id = s.program_id
    WHERE s.student_id = ?
  `;

  enrolSystemDb.query(query, [studentId], (err, results) => {
    if (err) {
      console.error("Error fetching program name:", err);
      return res.status(500).json({ error: "Failed to fetch program name." });
    }

    if (results.length > 0) {
      res.json({ program_name: results[0].program_name });
    } else {
      res.status(404).json({ error: "Program not found for the given student ID." });
    }
  });
};

module.exports = {
  getProgramByStudentId,
};