const { enrolSystemDb } = require('../db');

const getProgramByStudentId = (req, res) => {
  const studentId = req.query.studentId;

  if (!studentId) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  const query = `
    SELECT p.program_name
    FROM programs p
    JOIN students s ON p.program_id = s.program_id
    WHERE s.student_id = ?
  `;

  enrolSystemDb.query(query, [studentId], (err, results) => {
    if (err) {
      console.error("Error fetching program name:", err);
      return res.status(500).json({ error: "Failed to fetch program name." });
    }

    if (results.length > 0) {
      res.json({ program_name: results[0].program_name });
    } else {
      res.status(404).json({ error: "Program not found for the given student ID." });
    }
  });
};

module.exports = {
  getProgramByStudentId,
};