// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Controller\programCourseController.js
const { getProgramCourses } = require('../Model/programCourseModel');
const { getStudentProfileById } = require('../Model/studentProfileModel');
const AppError = require("../appError");

const getProgramCoursesHandler = async (req, res, next) => {
  const { studentId } = req.query;

  try {
    // Fetch student profile to get program_id
    const studentProfile = await new Promise((resolve, reject) => {
      getStudentProfileById(studentId, (err, profile) => {
        if (err) {
          reject(err);
        } else {
          resolve(profile);
        }
      });
    });

    if (!studentProfile) {
      return res.status(404).json({ details: { message: "Student not found" } });
    }

    const programId = studentProfile.program_id;

    // Fetch courses based on program_id
    const programCourses = await new Promise((resolve, reject) => {
      getProgramCourses(programId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(programCourses);
  } catch (error) {
    console.error("Error fetching program courses:", error);
    //res.status(500).json({ details: { message: "An Unexpected Error Occurred" } });
    next(new AppError("DB_ERROR", "Error fetching program courses", 500)); // Pass the error to the error middleware
  }
};

module.exports = {
  getProgramCourses: getProgramCoursesHandler,
};