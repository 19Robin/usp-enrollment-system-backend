const { get } = require('mongoose');
const { getCompletedCoursesFromDB, getCourseDetailsByStudentAndCourseFromDB, getGradeIdFromDB, createApplicationInDB, createGradeRecheckInDB, getCompletedCoursesForRecheckFromDB} = require('../Model/gradesModel');
const AppError = require("../appError");

// Function to handle the submission of a grade recheck application
const submitGradeRecheckApplication = async (req, res, next) => {
  const { studentId, courseCode, lecturerName, reason, term, recieptNumber} = req.body;

  if (!studentId || !courseCode || !lecturerName || !reason || !term || !recieptNumber) {
    return res.status(400).json({
      message: "Missing required fields: studentId, courseCode, lecturerName, reason, term, or recieptNumber."
    });
  }

  try {
    console.log("Fetching grade ID for student:", studentId, "and course:", courseCode);

    const gradeId = await getGradeIdFromDB(studentId, courseCode, term);

    if (!gradeId) {
      return res.status(404).json({ message: "Grade not found for student and course." });
    }

    console.log("Creating application for student:", studentId);

    const appId = await createApplicationInDB(studentId);

    if (!appId) {
      throw new AppError('DB_ERROR', 'Failed to create application.', 500);
    }

    console.log("Creating grade recheck entry...");

    await createGradeRecheckInDB(lecturerName, reason, gradeId, appId, recieptNumber);

    console.log("Grade recheck application submitted successfully for student:", studentId, "recieptNumber:", recieptNumber);

    res.status(201).json({ message: "Grade Recheck Application Submitted Successfully" });

  } catch (error) {
    console.error("Error in submitGradeRecheckApplication:", error);
    next(new AppError("DB_ERROR", "Grade Recheck Application Submission Failed", 500));
  }
};

// Function to get course details for a specific student and course code
const getCourseDetails = (req, res, next) => {
  const { studentId, courseCode } = req.params;

  getCourseDetailsByStudentAndCourseFromDB(studentId, courseCode, (err, courseDetails) => {
    if (err) {
      console.error('Error fetching course details:', err);
      next(new AppError("DB_ERROR", "Error fetching course details", 500));
      return res.status(500).json({ message: 'Internal server error.' });
    }

    if (!courseDetails || courseDetails.length === 0) {
      console.log('No course details found for the given student and course code.');
      return res.status(404).json({ message: 'Course details not found.' });
    }

    // Prepare response matching frontend expectations
    const response = {
      course_code: courseDetails[0].CourseID,       // Note: your DB returns CourseID, not course_code
      course_name: courseDetails[0].title,
      grade: courseDetails[0].grade,
      term: courseDetails[0].term,
      campus: courseDetails[0].campus,
      mode: courseDetails[0].mode
    };

    console.log('Course details:', response);
    res.status(200).json(response);
  }, next);
};

const getCompletedCourses = async (req, res, next) => {
  const { studentId } = req.query;
  try {
    const completedCourses = await new Promise((resolve, reject) => {
      getCompletedCoursesForRecheckFromDB(studentId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    res.status(200).json(completedCourses);
  } catch (error) {
    console.error("Error fetching completed courses:", error);
    //res.status(500).json({ error: "Failed to fetch completed courses" });
    next(new AppError("DB_ERROR", "Error fetching completed courses", 500));
  }
};

module.exports = {
  getCompletedCourses,
  getCourseDetails,
  submitGradeRecheckApplication,
};