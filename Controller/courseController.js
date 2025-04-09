const { getCourses, registerCourseInDB, getActiveRegistrationsFromDB, getDroppedRegistrationsFromDB, getCompletedCoursesFromDB, getCoursePrerequisitesFromDB} = require('../Model/courseModel');
const AppError = require('../appError');

const getCoursesHandler = async (req, res, next) => {
  try {
    const courses = await new Promise((resolve, reject) => {
      getCourses((err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    console.log("✅ API Response - Full Courses Data:", JSON.stringify(courses, null, 2)); // ✅ Debugging

    res.status(200).json(courses);
  } catch (error) {
    console.error("❌ Failed to fetch courses:", error);
    //res.status(500).json({ error: "Failed to fetch courses" });
    next(new AppError('DB_ERROR', "Failed to fetch courses.", 500))// Pass the error to the error middleware
  }
};


const registerCourseHandler = async (req, res, next) => {
  const { studentId, courseCode, semester, year } = req.body;

  try {
      // Directly register the course in the database
      const result = await new Promise((resolve, reject) => {
          registerCourseInDB(studentId, courseCode, semester, year, (err, result) => {
              if (err) return reject(err);
              resolve(result);
          });
      });

      if (result.affectedRows > 0) {
          res.status(200).json({ message: "Course registered successfully" });
      } else {
          //res.status(400).json({ error: "Course registration failed" });
          next(new AppError('DB_ERROR', 'Course registration failed.', 400)); // Pass the error to the error middleware
      }
  } catch (error) {
      console.error("Error registering course:", error);
      //res.status(500).json({ error: "Failed to register course" });
      next(new AppError('DB_ERROR', 'Course registration failed.', 500)); // Pass the error to the error middleware
  }
};


const getActiveRegistrations = async (req, res, next) => {
  const { studentId } = req.query;
  try {
    const registrations = await new Promise((resolve, reject) => {
      getActiveRegistrationsFromDB(studentId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    res.status(200).json(registrations);
  } catch (error) {
    //res.status(500).json({ error: "Failed to fetch active registrations" });
    next(new AppError('DB_ERROR', 'Failed to fetch active registrations.', 500)); // Pass the error to the error middleware
  }
};

const getDroppedRegistrations = async (req, res, next) => {
  const { studentId } = req.query;
  try {
    const registrations = await new Promise((resolve, reject) => {
      getDroppedRegistrationsFromDB(studentId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    res.status(200).json(registrations);
  } catch (error) {
    //res.status(500).json({ error: "Failed to fetch dropped registrations" });
    next(new AppError('DB_ERROR', 'Failed to fetch dropped registrations.', 500)); // Pass the error to the error middleware
  }
};

const getCompletedCourses = async (req, res, next) => {
  const { studentId } = req.query;
  try {
    const courses = await new Promise((resolve, reject) => {
      getCompletedCoursesFromDB(studentId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    res.status(200).json(courses);
  } catch (error) {
    //res.status(500).json({ error: "Failed to fetch completed courses" });
    next(new AppError('DB_ERROR', 'Failed to fetch completed courses.', 500)); // Pass the error to the error middleware
  }
};

const getCoursePrerequisites = async (req, res, next) => {
  try {
    const courses = await new Promise((resolve, reject) => {
      getCoursePrerequisitesFromDB((err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    console.log("✅ Fetched Course Prerequisites:", courses);
    res.status(200).json(courses);
  } catch (error) {
    console.error("❌ Failed to fetch course prerequisites:", error);
    //res.status(500).json({ error: "Failed to fetch course prerequisites" });
    next(new AppError('DB_ERROR', 'Failed to fetch course prerequisites.', 500)); // Pass the error to the error middleware
  }
};

module.exports = {
  getCourses: getCoursesHandler,
  registerCourse: registerCourseHandler,
  getActiveRegistrations,
  getDroppedRegistrations,
  getCompletedCourses,
  getCoursePrerequisites
};
