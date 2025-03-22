const { getCourses, registerCourseInDB, getActiveRegistrationsFromDB, getDroppedRegistrationsFromDB, getCompletedCoursesFromDB, checkPrerequisites } = require('../Model/courseModel');

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
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

const registerCourseHandler = async (req, res) => {
  const { studentId, courseCode, semester, year } = req.body;
  try {
    const missingPrereqs = await new Promise((resolve, reject) => {
      checkPrerequisites(studentId, courseCode, (err, prereqs) => {
        if (err) {
          reject(err);
        } else {
          resolve(prereqs);
        }
      });
    });

    if (missingPrereqs.length > 0) {
      return res.status(400).json({ error: `Missing prerequisites: ${missingPrereqs.join(", ")}` });
    }

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

module.exports = {
  getCourses: getCoursesHandler,
  registerCourse: registerCourseHandler,
  getActiveRegistrations,
  getDroppedRegistrations,
  getCompletedCourses,
};