// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Controller\studentProfileController.js
const { getStudentProfileById,updateStudentProfile  } = require('../Model/studentProfileModel');
const errorCodes = require('./errorCodes');
const AppError = require("../appError");  

const getStudentProfileHandler = async (req, res, next) => {
  const  studentId  = req.user.userId;
  console.log("Extracted User ID from Token:", studentId); 

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

    res.status(200).json({
      success: true,
      user:{
        
        data: {
          studentProfile
        },
        message: "Student Profile Retrieved Successfully"

      }
  
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    //res.status(500).json({ details: { message: "An Unexpected Error Occurred" } });
    next(new AppError("DB_ERROR", "Error fetching student profile", 500));
  }
};

module.exports = {
  getStudentProfile: getStudentProfileHandler,
  updateStudentProfile,
};