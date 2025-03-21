const db = require('../db');

const getCourses = (callback) => {
  const query = 'SELECT * FROM courses';
  db.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results);
  });
};

const registerCourseInDB = (studentId, courseCode, semester, year, callback) => {
  const query = 'INSERT INTO registrations (student_id, course_code, semester, year) VALUES (?, ?, ?, ?)';
  db.query(query, [studentId, courseCode, semester, year], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result);
  });
};

const getActiveRegistrationsFromDB = (studentId, callback) => {
  const query = 'SELECT * FROM registrations WHERE student_id = ?';
  db.query(query, [studentId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results);
  });
};

const getDroppedRegistrationsFromDB = (studentId, callback) => {
  const query = 'SELECT * FROM registrations WHERE student_id = ?';
  db.query(query, [studentId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results);
  });
};

module.exports = {
  getCourses,
  registerCourseInDB,
  getActiveRegistrationsFromDB,
  getDroppedRegistrationsFromDB,
};