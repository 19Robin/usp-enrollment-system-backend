// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Controller\courseController.js
const { getCourses } = require('../Model/courseModel');

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

module.exports = {
  getCourses: getCoursesHandler,
};