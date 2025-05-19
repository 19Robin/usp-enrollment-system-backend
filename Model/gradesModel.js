const { gradesDb, enrolSystemDb, applicationsDb } = require('../db');

const getCompletedCoursesFromDB = (studentId, callback, next) => {
  const gradesQuery = 'SELECT term, course_code AS CourseID, grade FROM grades WHERE student_id = ?';

  gradesDb.query(gradesQuery, [studentId], (err, gradesResults) => {
    if (err) {
      console.error("Error fetching grades:", err);
      return next(err); // Pass the error to the error middleware
    }

    const courseCodes = gradesResults.map(grade => grade.CourseID);
    if (courseCodes.length === 0) {
      return callback(null, gradesResults);
    }

    const coursesQuery = 'SELECT course_code, course_name, course_campus, course_mode FROM courses WHERE course_code IN (?)';
    enrolSystemDb.query(coursesQuery, [courseCodes], (err, coursesResults) => {
      if (err) {
        console.error("Error fetching courses:", err);
        return next(err); // Pass the error to the error middleware
      }

      const coursesMap = coursesResults.reduce((acc, course) => {
        acc[course.course_code] = { name: course.course_name, campus: course.course_campus, mode: course.course_mode };
        return acc;
      }, {});

      const combinedResults = gradesResults.map(grade => ({
        ...grade,
        title: coursesMap[grade.CourseID]?.name || 'Unknown Course',
        campus: coursesMap[grade.CourseID]?.campus || 'Unknown Campus',
        mode: coursesMap[grade.CourseID]?.mode || 'Unknown Mode'
      }));

      callback(null, combinedResults);
    });
  });
};

// Function to retrieve completed courses eligible for grade recheck
const getCompletedCoursesForRecheckFromDB = (studentId, callback, next) => {
  const gradesQuery = `
    SELECT g.term, g.course_code AS CourseID, g.grade, c.course_name, c.course_campus, c.course_mode 
    FROM usp_grades.grades g
    JOIN usp_enrol_system.courses c ON g.course_code = c.course_code
    WHERE g.student_id = ? AND g.grade NOT IN ('A', 'B', 'C')
  `;
  
  // Query to find completed courses with grades that can be rechecked
  gradesDb.query(gradesQuery, [studentId], (err, results) => {
    if (err) {
      console.error("Error fetching grades for recheck:", err);
      return next(err); // Pass the error to the error middleware
    }
    callback(null, results);
  });
};

// Function to retrieve course details for a specific student and course code
const getCourseDetailsByStudentAndCourseFromDB = (studentId, courseCode, callback, next) => {
  const gradesQuery = `
    SELECT term, course_code AS CourseID, grade
    FROM usp_grades.grades
    WHERE student_id = ? AND course_code = ?
  `;

  gradesDb.query(gradesQuery, [studentId, courseCode], (err, gradesResults) => {
    if (err) {
      console.error("Error fetching grades:", err);
      return next(err);
    }

    if (gradesResults.length === 0) {
      return callback(null, []); // No grades found
    }

    const coursesQuery = `
      SELECT course_code, course_name, course_campus, course_mode
      FROM usp_enrol_system.courses
      WHERE course_code = ?
    `;

    enrolSystemDb.query(coursesQuery, [courseCode], (err, coursesResults) => {
      if (err) {
        console.error("Error fetching course details:", err);
        return next(err);
      }

      if (coursesResults.length === 0) {
        return callback(null, []); // No course details found
      }

      // Combine grades and course details
      const combinedResult = gradesResults.map(grade => ({
        ...grade,
        title: coursesResults[0].course_name || "Unknown Course",
        campus: coursesResults[0].course_campus || "Unknown Campus",
        mode: coursesResults[0].course_mode || "Unknown Mode",
      }));

      callback(null, combinedResult);
    });
  });
};

//Function to retrieve grade ID from DB
const getGradeIdFromDB = (studentId, courseCode, term) => {
  return new Promise((resolve, reject) => {
    console.log("getGradeIdFromDB called with studentId:", studentId, "courseCode:", courseCode, "term:", term);
    console.log("SQL Query: SELECT grade_id FROM usp_grades.grades WHERE student_id = ? AND course_code = ? AND term = ? LIMIT 1");
    const sql = `
      SELECT grade_id 
      FROM usp_grades.grades 
      WHERE student_id = ? AND course_code = ? AND term = ?
      LIMIT 1
    `;
    console.log("executing query....");
    gradesDb.execute(sql, [studentId, courseCode, term], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return reject(err);
      }
      if (!results || results.length === 0) {
        console.log("No results found for the given studentId, courseCode, and term.");
        return resolve(null); // grade not found
      }
      console.log("Query Result:", results);
      resolve(results[0].grade_id);
    });
  });
};

//Function to create a grade recheck application in the database 
const createGradeRecheckInDB = async (lecturerName, reason, gradeId, appId, recieptNumber) => {
  console.log("createGradeRecheckInDB called with:", { lecturerName, reason, gradeId, appId, recieptNumber });
  const sql = 'INSERT INTO usp_applications.grade_recheck_applications (lecturer_name, reason, grade_id, app_id, receipt_number) VALUES (?, ?, ?, ?, ?)';
  await applicationsDb.execute(sql, [lecturerName, reason, gradeId, appId, recieptNumber]); // Use applicationsDb explicitly
  console.log("Grade recheck application created in DB.");
};

// Function to create a new application in the database
const createApplicationInDB = (studentId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO usp_applications.applications 
      (student_id, application_type_id, status_id, submitted_at, updated_at) 
      VALUES (?, 2, 1, NOW(), NOW())
    `;

    applicationsDb.execute(sql, [studentId], (err, result) => {
      if (err) {
        console.error("DB Insert Error:", err);
        return reject(err);
      }

      console.log("Raw Result:", result);

      if (!result || typeof result.insertId === 'undefined') {
        return reject(new Error("No insertId returned"));
      }

      resolve(result.insertId);
    });
  });
};

module.exports = {
  getGradeIdFromDB,
  createApplicationInDB,
  createGradeRecheckInDB,
  getCourseDetailsByStudentAndCourseFromDB,
  getCompletedCoursesForRecheckFromDB,
  getCompletedCoursesFromDB,
};