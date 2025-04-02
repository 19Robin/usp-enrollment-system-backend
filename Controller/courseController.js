const { getCourses, registerCourseInDB, getActiveRegistrationsFromDB, getDroppedRegistrationsFromDB, getCompletedCoursesFromDB, getCoursePrerequisitesFromDB} = require('../Model/courseModel');

const getCoursesHandler = async (req, res) => {
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
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};


const registerCourseHandler = async (req, res) => {
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
          res.status(400).json({ error: "Course registration failed" });
      }
  } catch (error) {
      console.error("Error registering course:", error);
      res.status(500).json({ error: "Failed to register course" });
  }
};


const getActiveRegistrations = async (req, res) => {
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
    res.status(500).json({ error: "Failed to fetch active registrations" });
  }
};

const getDroppedRegistrations = async (req, res) => {
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
    res.status(500).json({ error: "Failed to fetch dropped registrations" });
  }
};

const getCompletedCourses = async (req, res) => {
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
    res.status(500).json({ error: "Failed to fetch completed courses" });
  }
};

const getCoursePrerequisites = async (req, res) => {
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
    res.status(500).json({ error: "Failed to fetch course prerequisites" });
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
