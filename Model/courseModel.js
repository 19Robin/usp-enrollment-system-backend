// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Model\courseModel.js
const db = require('../db');

const addCourse = (course, callback) => {
  const query = 'INSERT INTO courses (course_id, course_name, course_description) VALUES (?, ?, ?)';
  db.query(query, [course.course_id, course.course_name, course.course_description], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results);
  });
};

module.exports = {
  addCourse,
};