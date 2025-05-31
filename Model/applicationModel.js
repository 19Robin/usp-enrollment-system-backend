const { applicationsDb, enrolSystemDb } = require("../db");

// Create a new application in the applications table
const createGraduationApplicationInDB = (studentId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO applications 
      (student_id, application_type_id, status_id, submitted_at, updated_at) 
      VALUES (?, 2, 1, NOW(), NOW())
    `;
    applicationsDb.execute(sql, [studentId], (err, result) => {
      if (err) return reject(err);
      if (!result || typeof result.insertId === 'undefined') {
        return reject(new Error("No insertId returned"));
      }
      resolve(result.insertId);
    });
  });
};

// Insert into graduation_applications table
const saveGraduationApplication = (studentId, applicationTypeId = 2, statusId = 1) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO graduation_applications (student_id, application_type_id, status_id, submitted_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
    `;
    applicationsDb.query(sql, [studentId, applicationTypeId, statusId], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

// Save exam-related application (Compassionate, Special Exam, Aegrotat)
const saveExamApplication = (
  studentId,
  applicationTypeId,
  statusId,
  reason,
  courseId,
  examDate,
  examTime,
  supportingDocsUrl
) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO exam_applications
      (student_id, application_type_id, status_id, reason, submitted_at, updated_at, course_id, exam_date, exam_time, supporting_docs_url)
      VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?)
    `;
    applicationsDb.query(
      sql,
      [studentId, applicationTypeId, statusId, reason, courseId, examDate, examTime, supportingDocsUrl],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
};

// Get student name and email
const getStudentInfo = (studentId) => {
  return new Promise((resolve, reject) => {
    enrolSystemDb.query(
      "SELECT CONCAT(first_name, ' ', last_name) AS name, email FROM students WHERE student_id = ? LIMIT 1",
      [studentId],
      (err, results) => {
        if (err) {
          console.error("Error fetching student info:", err);
          return reject(err);
        }
        if (!results || results.length === 0) return resolve(null);
        resolve(results[0]);
      }
    );
  });
};

const getAllStudentApplications = (studentId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        a.id AS applicationId,
        YEAR(a.submitted_at) AS yearApplied,
        a.student_id AS studentId,
        t.type AS applicationType,
        s.status_name AS status,
        a.submitted_at AS dateApplied
      FROM usp_applications.applications a
      JOIN usp_applications.app_type t ON a.application_type_id = t.type_id
      JOIN usp_applications.app_statuses s ON a.status_id = s.id
      WHERE a.student_id = ?
      ORDER BY a.submitted_at DESC
    `;
    applicationsDb.query(sql, [studentId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = { 
  createGraduationApplicationInDB, 
  saveGraduationApplication, 
  getStudentInfo, 
  saveExamApplication,
  getAllStudentApplications
};