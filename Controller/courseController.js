const { getCourses, registerCourseInDB, getActiveRegistrationsFromDB, getDroppedRegistrationsFromDB } = require('../Model/courseModel');

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

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ details: { message: "An Unexpected Error Occurred" } });
  }
};

const registerCourseHandler = async (req, res) => {
  const { studentId, courseCode, semester, year } = req.body;

  try {
    await new Promise((resolve, reject) => {
      registerCourseInDB(studentId, courseCode, semester, year, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Course registered successfully" });
  } catch (error) {
    console.error("Error registering course:", error);
    res.status(500).json({ details: { message: "An Unexpected Error Occurred" } });
  }
};

const getActiveRegistrations = async (req, res) => {
  const { studentId } = req.query;

  try {
    const activeRegistrations = await new Promise((resolve, reject) => {
      getActiveRegistrationsFromDB(studentId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(activeRegistrations);
  } catch (error) {
    console.error("Error fetching active registrations:", error);
    res.status(500).json({ message: "Failed to fetch active registrations data." });
  }
};

const getDroppedRegistrations = async (req, res) => {
  const { studentId } = req.query;

  try {
    const droppedRegistrations = await new Promise((resolve, reject) => {
      getDroppedRegistrationsFromDB(studentId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(droppedRegistrations);
  } catch (error) {
    console.error("Error fetching dropped registrations:", error);
    res.status(500).json({ message: "Failed to fetch dropped registrations data." });
  }
};

module.exports = {
  getCourses: getCoursesHandler,
  registerCourse: registerCourseHandler,
  getActiveRegistrations,
  getDroppedRegistrations,
};