// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Controller\studentProfileController.js
const { getStudentProfileById } = require('../Model/studentProfileModel');
const errorCodes = require('./errorCodes');

const getStudentProfileHandler = async (req, res) => {
  const { studentId } = req.params;

  try {
    const studentProfile = await new Promise((resolve, reject) => {
      getStudentProfileById(studentId, (err, profile) => {
        if (err) {
          reject(err);
        } else {
          resolve(profile);
        }
      });
    });

    if (!studentProfile) {
      return res.status(404).json({ details: errorCodes.INVALID_CREDENTIALS });
    }

    res.status(200).json(studentProfile);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ details: { message: "An Unexpected Error Occurred" } });
  }
};

module.exports = {
  getStudentProfile: getStudentProfileHandler,
};