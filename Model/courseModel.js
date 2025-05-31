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

const registerCourseInDB = (studentId, courseCode, semester, year, req, callback) => {
  // Fetch course details first
  const courseQuery = 'SELECT course_name, course_campus, course_mode, course_id FROM courses WHERE course_code = ?';
  enrolSystemDb.query(courseQuery, [courseCode], (err, courseDetails) => {
    if (err) {
      console.error("Error fetching course details:", err);
      return callback(err, null);
    }

    if (courseDetails.length === 0) {
      const error = new Error("Course not found");
      error.status = 404; // Not Found
      return callback(error, null);
    }

    const { course_name, course_campus, course_mode, course_id } = courseDetails[0];

    // Extract timezone offset from the request headers
    const timezoneOffset = parseInt(req.headers['x-timezone-offset'] || 0); // Default to UTC if not provided
    const now = new Date();
    now.setMinutes(now.getMinutes() - timezoneOffset); // Adjust to the client's local time

    const reg_action_date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; // YYYY-MM-DD
    const reg_action_time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`; // HH:MM:SS

    // Insert into the registrations table with the fetched course details
    const query = `
      INSERT INTO registrations 
      (student_id, course_code, semester, year, status, course_name, course_campus, course_mode, course_id, reg_action_date, reg_action_time) 
      VALUES (?, ?, ?, ?, 'active', ?, ?, ?, ?, ?, ?)
    `;

    enrolSystemDb.query(query, [studentId, courseCode, semester, year, course_name, course_campus, course_mode, course_id, reg_action_date, reg_action_time], (err, result) => {
      if (err) {
        console.error("Error registering course:", err);
        return callback(err, null);
      }
      console.log("Course registered successfully:", result);
      callback(null, result);

      const registrationId = result.insertId;

      const feeQuery = `INSERT INTO fees (fee_type, registration_id) VALUES (?, ?)`;

      enrolSystemDb.query(feeQuery, ['Tuition fees', registrationId], (err, feeResult) => {
        if (err) {
          console.error("Error inserting fee:", err);
          return callback(err, null);
        }

        console.log("Fee inserted successfully:", feeResult);

        const invoiceQuery = `INSERT INTO invoices (student_id, fee_id, due_date) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))`;
        const feeId = feeResult.insertId;

        enrolSystemDb.query(invoiceQuery, [studentId, feeId], (err, invoiceResult) => {
          if (err) {
            console.error("Error inserting invoice:", err);
            return callback(err, null);
          }

          console.log("Invoice inserted successfully:", invoiceResult);
          callback(null, invoiceResult);
        });
      });
    });
  });
};


const getActiveRegistrationsFromDB = (studentId, callback, next) => {
  const start = Date.now();
  const query = 'SELECT * FROM registrations WHERE student_id = ? AND status = "active"';
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
  const query = 'SELECT * FROM registrations WHERE student_id = ? AND status = "cancelled"';
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

const cancelCourseRegistration = (studentId, courseCode, req, callback) => {
  // Extract timezone offset from the request headers
  const timezoneOffset = parseInt(req.headers['x-timezone-offset'] || 0); // Default to UTC if not provided
  const now = new Date();
  now.setMinutes(now.getMinutes() - timezoneOffset); // Adjust to the client's local time

  const cancelReg_date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; // YYYY-MM-DD
  const cancelReg_time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`; // HH:MM:SS

  const query = `
    UPDATE registrations 
    SET status = 'cancelled', cancelReg_date = ?, cancelReg_time = ? 
    WHERE student_id = ? AND course_code = ? AND status = 'active'
  `;

  enrolSystemDb.query(query, [cancelReg_date, cancelReg_time, studentId, courseCode], (err, result) => {
    if (err) {
      console.error("Error canceling course registration:", err);
      return callback(err, null);
    }
    console.log("Course registration canceled successfully:", result);
    callback(null, result);
  });
};

const getCompletedCoursesFromDB = (studentId, callback) => {
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
  cancelCourseRegistration,
  getActiveRegistrationsFromDB,
  getDroppedRegistrationsFromDB,
  getCompletedCoursesFromDB,
  checkPrerequisites,
  getCoursePrerequisitesFromDB
};