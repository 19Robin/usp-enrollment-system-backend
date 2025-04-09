const { enrolSystemDb, gradesDb } = require('../db');
const util = require('util');
const queryAsync = util.promisify(enrolSystemDb.query).bind(enrolSystemDb);
const AppError = require('../appError');

const getCourses = async (next) => {
  try {
    const query = `
      SELECT 
        course_code, 
        course_name, 
        course_campus, 
        course_mode, 
        COALESCE(pre_requisite, 'None') AS prerequisites,
        semester 
      FROM courses
    `;
    return await queryAsync(query);
  } catch (err) {
    console.error("❌ Error fetching courses:", err);
    return next(new AppError('DB_ERROR', 'Course Database query failed.', 500)); // Pass the error to the error middleware
  }
};

const registerCourseInDB = (studentId, courseCode, semester, year, callback, next) => {
  // Fetch course details first
  const courseQuery = 'SELECT course_name, course_campus, course_mode FROM courses WHERE course_code = ?';
  enrolSystemDb.query(courseQuery, [courseCode], (err, courseDetails) => {
    if (err) {
      console.error("Error fetching course details:", err);
      return next(err); // Pass the error to the error middleware
    }

    if (courseDetails.length === 0) {
      const error = new Error("Course not found");
      error.status = 404; // Not Found
      return next(error); // Pass the error to the error middleware
    }

    const { course_name, course_campus, course_mode } = courseDetails[0];
    
    // Now insert into the registrations table with the fetched course details
    const query = `INSERT INTO registrations (student_id, course_code, semester, year, status, course_name, course_campus, course_mode) 
                   VALUES (?, ?, ?, ?, 'active', ?, ?, ?)`;

    enrolSystemDb.query(query, [studentId, courseCode, semester, year, course_name, course_campus, course_mode], (err, result) => {
      if (err) {
        console.error("Error registering course:", err);
        return next(err); // Pass the error to the error middleware
      }
      console.log("Course registered successfully:", result);
      callback(null, result);
    });
  });
};


const getActiveRegistrationsFromDB = (studentId, callback, next) => {
  const start = Date.now();
  const query = 'SELECT * FROM registrations WHERE student_id = ?';
  enrolSystemDb.query(query, [studentId], (err, results) => {
    const end = Date.now();
    console.log(`getActiveRegistrationsFromDB query took ${end - start}ms`);
    if (err) {
      console.error("Error fetching active registrations:", err);
      return next(err); // Pass the error to the error middleware
    } else {
      console.log("Active registrations fetched:", results);
    }
    callback(err, results);
  });
};

const getDroppedRegistrationsFromDB = (studentId, callback, next) => {
  const start = Date.now();
  const query = 'SELECT * FROM registrations WHERE student_id = ? AND status = "withdrawn"';
  enrolSystemDb.query(query, [studentId], (err, results) => {
    const end = Date.now();
    console.log(`getDroppedRegistrationsFromDB query took ${end - start}ms`);
    if (err) {
      console.error("Error fetching dropped registrations:", err);
      return next(err); // Pass the error to the error middleware
    } else {
      console.log("Dropped registrations fetched:", results);
    }
    callback(err, results);
  });
};

const getCompletedCoursesFromDB = (studentId, callback, next) => {
  const start = Date.now();
  const query = 'SELECT course_code FROM grades WHERE student_id = ? AND grade NOT IN ("D", "E", "F")';
  gradesDb.query(query, [studentId], (err, results) => {
    const end = Date.now();
    console.log(`getCompletedCoursesFromDB query took ${end - start}ms`);
    if (err) {
      console.error("Error fetching completed courses:", err);
      return next(err); // Pass the error to the error middleware
    } else {
      console.log("Completed courses fetched:", results);
    }
    callback(err, results);
  });
};

const getCoursePrerequisitesFromDB = (callback, next) => {
  const query = `
    SELECT 
      course_id, 
      course_code, 
      course_name, 
      COALESCE(pre_requisite, 'None') AS pre_requisite, -- Handle NULL prerequisites
      course_campus, 
      course_mode, 
      semester
    FROM courses
  `;

  enrolSystemDb.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching course prerequisites:", err);
      return next(err); // Pass the error to the error middleware
    }
    console.log("✅ Course Prerequisites Query Results:", results);
    callback(null, results);
  });
};

const checkPrerequisites = (studentId, courseCode, callback, next) => {
  const query = `
    SELECT prereq.course_code AS prereq_code
    FROM prerequisites prereq
    LEFT JOIN grades g ON prereq.prereq_code = g.course_code AND g.student_id = ?
    WHERE prereq.course_code = ? AND (g.grade IS NULL OR g.grade IN ("D", "E", "F"))
  `;
  gradesDb.query(query, [studentId, courseCode], (err, results) => {
    if (err) {
      console.error("Error checking prerequisites:", err);
      return next(err); // Pass the error to the error middleware
    } else {
      const missingPrereqs = results.map(row => row.prereq_code);
      callback(null, missingPrereqs);
    }
  });
};

module.exports = {
  getCourses,
  registerCourseInDB,
  getActiveRegistrationsFromDB,
  getDroppedRegistrationsFromDB,
  getCompletedCoursesFromDB,
  checkPrerequisites,
  getCoursePrerequisitesFromDB
};