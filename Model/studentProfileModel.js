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
const updateStudentProfile = (req, res) => {
  const studentId = req.params.studentId;
  const { email, phone } = req.body;

  const query = `
    UPDATE students
    SET email = ?, phone = ?
    WHERE student_id = ?
  `;

  enrolSystemDb.query(query, [email, phone, studentId], (err, result) => {
    if (err) {
      console.error("Error updating profile:", err);
      return res.status(500).json({ error: "Failed to update profile." });
    }
    res.json({ success: true, message: "Profile updated successfully." });
  });
};

module.exports = {
  getStudentProfileById,
  updateStudentProfile,
};