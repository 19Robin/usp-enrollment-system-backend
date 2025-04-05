// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Controller\authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getStudentById, getManagerById } = require("../Model/userModel");
const errorCodes = require("./errorCodes");
require("dotenv").config();

const loginAttemptHandler = async (req, res) => {
  const { userId, password } = req.body;

  try {
    let user;
    if (userId.startsWith('S')) {
      user = await new Promise((resolve, reject) => {
        getStudentById(userId, (err, user) => {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        });
      });
    } else if (userId.startsWith('H')) {
      user = await new Promise((resolve, reject) => {
        getManagerById(userId, (err, user) => {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        });
      });
    }

    if (!user) {
      return res.status(401).json({ details: errorCodes.INVALID_CREDENTIALS });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ details: errorCodes.INVALID_CREDENTIALS });
    }

    console.log("JWT Payload:", { 
      userId: user.student_id || user.manager_id, 
      username: user.first_name,
      role: user.role 
    });

    // Generate JWT token
    // change user_id to user.student_id or user.manager_id based on the role
    const token = jwt.sign({ userId: user.student_id || user.manager_id, username: user.first_name, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      success: true,
      token: token,
      role: "student",
    });
  } catch (error) {
    console.error("Error during login process:", error);
    res.status(500).json({ details: { message: "An Unexpected Error Occurred" } });
  }
};

module.exports = {
  loginAttempt: loginAttemptHandler,
};