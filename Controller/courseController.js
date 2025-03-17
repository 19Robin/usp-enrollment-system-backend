// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Controller\courseController.js
const { addCourse } = require('../Model/courseModel');
const errorCodes = require('./errorCodes');

const addCourseHandler = async (req, res) => {
  const { course_id, course_name, course_description } = req.body;

  try {
    const course = { course_id, course_name, course_description };
    const result = await new Promise((resolve, reject) => {
      addCourse(course, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(201).json({
      message: "Course added successfully",
      course: result,
    });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ details: { message: "An Unexpected Error Occurred" } });
  }
};

module.exports = {
  addCourse: addCourseHandler,
};