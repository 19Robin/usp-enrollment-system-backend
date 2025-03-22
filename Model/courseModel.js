const { enrolSystemDb, gradesDb } = require('../db');

const getCourses = (callback) => {
  const start = Date.now();
  const query = 'SELECT * FROM courses';
  enrolSystemDb.query(query, (err, results) => {
    const end = Date.now();
    console.log(`getCourses query took ${end - start}ms`);
    if (err) {
      console.error("Error fetching courses:", err);
    } else {
      console.log("Courses fetched:", results);
    }
    callback(err, results);
  });
};

const registerCourseInDB = (studentId, courseCode, semester, year, callback) => {
  const start = Date.now();
  const query = 'INSERT INTO registrations (student_id, course_code, semester, year, status) VALUES (?, ?, ?, ?, ?)';
  enrolSystemDb.query(query, [studentId, courseCode, semester, year, 'active'], (err, result) => {
    const end = Date.now();
    console.log(`registerCourseInDB query took ${end - start}ms`);
    if (err) {
      console.error("Error registering course:", err);
    } else {
      console.log("Course registered:", result);
    }
    callback(err, result);
  });
};

const getActiveRegistrationsFromDB = (studentId, callback) => {
  const start = Date.now();
  const query = 'SELECT * FROM registrations WHERE student_id = ?';
  enrolSystemDb.query(query, [studentId], (err, results) => {
    const end = Date.now();
    console.log(`getActiveRegistrationsFromDB query took ${end - start}ms`);
    if (err) {
      console.error("Error fetching active registrations:", err);
    } else {
      console.log("Active registrations fetched:", results);
    }
    callback(err, results);
  });
};

const getDroppedRegistrationsFromDB = (studentId, callback) => {
  const start = Date.now();
  const query = 'SELECT * FROM registrations WHERE student_id = ? AND status = "withdrawn"';
  enrolSystemDb.query(query, [studentId], (err, results) => {
    const end = Date.now();
    console.log(`getDroppedRegistrationsFromDB query took ${end - start}ms`);
    if (err) {
      console.error("Error fetching dropped registrations:", err);
    } else {
      console.log("Dropped registrations fetched:", results);
    }
    callback(err, results);
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
    } else {
      console.log("Completed courses fetched:", results);
    }
    callback(err, results);
  });
};

const checkPrerequisites = (studentId, courseCode, callback) => {
  const query = `
    SELECT prereq.course_code AS prereq_code
    FROM prerequisites prereq
    LEFT JOIN grades g ON prereq.prereq_code = g.course_code AND g.student_id = ?
    WHERE prereq.course_code = ? AND (g.grade IS NULL OR g.grade IN ("D", "E", "F"))
  `;
  enrolSystemDb.query(query, [studentId, courseCode], (err, results) => {
    if (err) {
      console.error("Error checking prerequisites:", err);
      callback(err, null);
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
  checkPrerequisites
};