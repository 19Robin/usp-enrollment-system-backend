const { get } = require('mongoose');
const {
  gradeRecheckApplication,
  getCompletedCoursesFromDB,
  getCourseDetailsByStudentAndCourseFromDB,
  getGradeIdFromDB,
  createApplicationInDB,
  createGradeRecheckInDB,
  getCompletedCoursesForRecheckFromDB
} = require('../Model/gradesModel');
const { getStudentInfo } = require('../Model/applicationModel');
const { sendGradeRecheckApplicationEmail } = require('../Emails/application');
const AppError = require("../appError");
const { application } = require('express');

// Function to handle the submission of a grade recheck application
const submitGradeRecheckApplication = async (req, res, next) => {
  const { studentId, courseCode, lecturerName, reason, term, recieptNumber, application_type_id, status_id } = req.body;

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
      return res.status(500).json({ message: "Failed to create application." });
    }

    console.log("Creating grade recheck entry...");

    await createGradeRecheckInDB(
      studentId,
      lecturerName,
      reason,
      gradeId,
      appId,
      recieptNumber,
      application_type_id || 2,
      status_id || 1
    );

    // --- Send notification email to student ---
    try {
      const student = await getStudentInfo(studentId);
      if (student && student.email) {
        await sendGradeRecheckApplicationEmail(student.name, student.email);
      }
    } catch (emailErr) {
      console.error("Warning: Application saved but failed to send email:", emailErr);
    }

    console.log("Grade recheck application submitted successfully for student:", studentId, "recieptNumber:", recieptNumber);

    return res.status(201).json({ message: "Grade Recheck Application Submitted Successfully" });

  } catch (error) {
    console.error("Error in submitGradeRecheckApplication:", error);
    // Always send a response!
    return res.status(500).json({ message: "Grade Recheck Application Submission Failed", error: error.message });
  }
};

//check if application already exists for a student and course code
const checkApplication = async (req, res) => {
  try {
    const { studentId, courseCode, term } = req.params; // ✅ Use params, not query
    const gradeId = await getGradeIdFromDB(studentId, courseCode, term);

    if (!gradeId) {
      return res.status(404).json({ message: "Grade not found for student and course." });
    }

    if (!studentId || !courseCode) {
      return res.status(400).json({ error: 'Missing studentId or courseCode' });
    }

    const alreadyApplied = await gradeRecheckApplication.exists(studentId, gradeId);

    res.json({ exists: alreadyApplied }); // ✅ Make sure the frontend gets { exists: true/false }
  } catch (error) {
    console.error('Error checking application:', error);
    res.status(500).json({ error: 'Internal server error' });
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

    if (!courseDetails) {
      console.log('No course details found for the given student and course code.');
      return res.status(404).json({ message: 'Course details not found.' });
    }

    // Prepare response matching frontend expectations
    const response = {
      course_code: courseDetails.CourseID,
      course_name: courseDetails.title,
      grade: courseDetails.grade,
      term: courseDetails.term,
      campus: courseDetails.campus,
      mode: courseDetails.mode
    };

    console.log('Course details:', response);
    res.status(200).json(response);
  }, next);
};

const getCompletedCourses = async (req, res, next) => {
  const { studentId } = req.query;
  try {
    const completedCourses = await new Promise((resolve, reject) => {
      getCompletedCoursesFromDB(studentId, (err, results) => { // <-- FIXED: use all grades
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
    next(new AppError("DB_ERROR", "Error fetching completed courses", 500));
  }
};

module.exports = {
  getCompletedCourses,
  getCourseDetails,
  submitGradeRecheckApplication,
  checkApplication
};