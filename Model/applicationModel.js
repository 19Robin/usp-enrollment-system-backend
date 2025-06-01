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

<<<<<<< HEAD
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
=======
// Get all applications (merged from 3 application tables)
const getApplicationByStudentIdFromDB = (studentId, callback, next) => {
  const appTypeQuery = `SELECT type_id AS id, type AS name FROM app_type`;
  const appStatusQuery = `SELECT id, status_name AS name FROM app_statuses`;

  const graduationQuery = `
    SELECT id, submitted_at, application_type_id, status_id 
    FROM graduation_applications 
    WHERE student_id = ?
  `;

  const examQuery = `
    SELECT id, submitted_at, application_type_id AS application_type_id, status_id 
    FROM exam_applications 
    WHERE student_id = ?
  `;

  const gradeRecheckQuery = `
    SELECT id, submitted_at, application_type_id, status_id 
    FROM grade_recheck_applications 
    WHERE student_id = ?
  `;

  // Fetch all app types and statuses first
  applicationsDb.query(appTypeQuery, (err, types) => {
    if (err) return next(err);
    applicationsDb.query(appStatusQuery, (err, statuses) => {
      if (err) return next(err);

      const typeMap = {};
      const statusMap = {};

      types.forEach(t => { typeMap[t.id] = t.name; });
      statuses.forEach(s => { statusMap[s.id] = s.name; });

      // Now fetch all 3 application types
      Promise.all([
        new Promise((res, rej) => applicationsDb.query(graduationQuery, [studentId], (e, r) => e ? rej(e) : res(r))),
        new Promise((res, rej) => applicationsDb.query(examQuery, [studentId], (e, r) => e ? rej(e) : res(r))),
        new Promise((res, rej) => applicationsDb.query(gradeRecheckQuery, [studentId], (e, r) => e ? rej(e) : res(r)))
      ])
      .then(([graduationApps, examApps, gradeRecheckApps]) => {
        const all = [...graduationApps, ...examApps, ...gradeRecheckApps];
        const result = all.map(app => ({
          id: app.id,
          submitted_at: app.submitted_at,
          application_type: typeMap[app.application_type_id] || 'Unknown Type',
          status: statusMap[app.status_id] || 'Unknown Status'
        })).sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

        callback(null, result);
      })
      .catch(next);
>>>>>>> 178513730ae56c7f005c7e240faf1a5e6a24e0a2
    });
  });
};

<<<<<<< HEAD
=======
// Get details of a specific grade recheck application
const getGradeRecheckApplicationDetailsFromDB = (applicationId, applicationTypeId, callback, next) => {
  const sql = `
    SELECT 
      id, submitted_at, status_id, grade_id, lecturer, reason 
    FROM grade_recheck_applications 
    WHERE id = ? AND application_type_id = ?
  `;
  applicationsDb.query(sql, [applicationId, applicationTypeId], (err, results) => { // Check if the query was successful
    if (err) return next(err);
    if (!results || results.length === 0) return callback(null, null);
    callback(null, results[0]);
  });
};

const getExamApplicationDetailsFromDB = (applicationId, applicationTypeId, callback, next) => {
  const sql = 'SELECT id, submitted_at, status_id, reason, course_id, exam_date, exam_time, supporting_docs_url FROM exam_applications WHERE id = ? AND application_type_id = ?';
  applicationsDb.query(sql, [applicationId, applicationTypeId], (err, results) => { // Check if the query was successful
    if (err) return next(err);
    if (!results || results.length === 0) return callback(null, null);
    callback(null, results[0]);
  });
};


// const getApplicationByStudentIdFromDB = (studentId, callback, next) => {
//   const graduationApplicationQuery = 'SELECT id, submitted_at, status_id, application_type_id FROM graduation_applications WHERE student_id = ? ORDER BY submitted_at DESC';  
//   const examApplicationQuery = 'SELECT id, submitted_at, application_type, status_id FROM exam_applications WHERE student_id = ? ORDER BY submitted_at DESC';
//   const gradeRecheckApplicationQuery = 'SELECT id, submitted_at, status_id, application_type_id FROM grade_recheck_applications WHERE student_id = ? ORDER BY submitted_at DESC';

  

//   // const applicationQuery = `
//   //       SELECT id, submitted_at, application_type_id, status_id
//   //       FROM applications
//   //       WHERE student_id = ?
//   //       ORDER BY submitted_at DESC
//   //   `;

//     const applicationTypeQuery = `SELECT type_id, type FROM app_type`;
//     const applicationStatusQuery = `SELECT id, status_name FROM app_statuses`;

//     // Step 1: Fetch all applications for the student
//     applicationsDb.query(applicationQuery, [studentId], (err, applications) => {
//         if (err) {
//             console.error("Error fetching applications:", err);
//             return next(err);
//         }
//           console.log("Fetched applications:", applications); // Debug log
//         // Step 2: Fetch application types
//         applicationsDb.query(applicationTypeQuery, (err, types) => {
//             if (err) {
//                 console.error("Error fetching application types:", err);
//                 return next(err);
//             }
//             console.log("Fetched application types:", types); // Debug log
//             // Step 3: Fetch application statuses
//             applicationsDb.query(applicationStatusQuery, (err, statuses) => {
//                 if (err) {
//                     console.error("Error fetching application statuses:", err);
//                     return next(err);
//                 }

//                 // Create maps for types and statuses
//                 const typeMap = {};
//                 const statusMap = {};

//                 types.forEach(type => {
//                     typeMap[type.id] = type.name;
//                 });

//                 statuses.forEach(status => {
//                     statusMap[status.id] = status.status;
//                 });

//                 // Join everything manually
//                 const combinedResults = applications.map(app => ({
//                     id: app.id,
//                     submitted_at: app.submitted_at,
//                     application_type: typeMap[app.application_type_id] || 'Unknown Type',
//                     status: statusMap[app.status_id] || 'Unknown Status'
//                 }));
//                   console.log("Combined results:", combinedResults); // Debug log

//                 callback(null, combinedResults);
//             });
//         });
//     });
// };


// const getGradeRecheckApplicationDetailsFromDB = (applicationId, applicationTypeId, callback, next) => {
//     const applicationQuery = 'SELECT id, submitted_at, status_id, grade_id, lecturer, reason FROM grade_recheck_applications WHERE id = ? AND application_type_id = ?';
// }

>>>>>>> 178513730ae56c7f005c7e240faf1a5e6a24e0a2
module.exports = { 
  createGraduationApplicationInDB, 
  saveGraduationApplication, 
  getStudentInfo, 
  saveExamApplication,
<<<<<<< HEAD
  getAllStudentApplications
=======
  getApplicationByStudentIdFromDB,
  getGradeRecheckApplicationDetailsFromDB,
  getExamApplicationDetailsFromDB
>>>>>>> 178513730ae56c7f005c7e240faf1a5e6a24e0a2
};