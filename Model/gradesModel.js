const { gradesDb, enrolSystemDb } = require('../db');

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

module.exports = {
  getCompletedCoursesFromDB,
};