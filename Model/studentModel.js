// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Model\userModel.js
const {db} = require('../db');

const getStudentById = (studentId, callback, next) => {
  const query = 'SELECT * FROM students WHERE student_id = ?';
  db.query(query, [studentId], (err, results) => {
    if (err) {
      return next(err); // Pass the error to the error middleware
    }
    if (results.length > 0) {
      return callback(null, results[0]);
    } else {
      return callback(null, null);
    }
  });
};

module.exports = {
  getStudentById,
};