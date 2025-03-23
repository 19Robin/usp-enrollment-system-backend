const { enrolSystemDb } = require('../db');

const getStudentProfileById = (studentId, callback) => {
  const query = `
    SELECT student_id, first_name, last_name, dob, email, phone, program_id, program_code
    FROM students
    WHERE student_id = ?
  `;
  enrolSystemDb.query(query, [studentId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length > 0) {
      return callback(null, results[0]);
    } else {
      return callback(null, null);
    }
  });
};

module.exports = {
  getStudentProfileById,
};