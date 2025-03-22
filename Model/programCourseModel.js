const { enrolSystemDb } = require('../db');

const getProgramCourses = (programId, callback) => {
  const query = `
    SELECT c.course_code, c.course_name, c.course_campus, c.course_mode
    FROM program_courses pc
    JOIN courses c ON pc.course_code = c.course_code
    WHERE pc.program_id = ?
  `;
  enrolSystemDb.query(query, [programId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results);
  });
};

module.exports = {
  getProgramCourses,
};