// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Controller\programController.js
const { getPrograms } = require('../Model/programModel');
const AppError = require("../appError");

const getProgramsHandler = async (req, res, next) => {
  try {
    const programs = await new Promise((resolve, reject) => {
      getPrograms((err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    //res.status(500).json({ details: { message: "An Unexpected Error Occurred" } });
    next(new AppError("DB_ERROR", "Error fetching programs", 500)); // Pass the error to the error middleware
  }
};

module.exports = {
  getPrograms: getProgramsHandler,
};