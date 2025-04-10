// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Controller\authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getStudentById, getManagerById, getRoleById} = require("../Model/userModel");
const errorCodes = require("./errorCodes");
const {createLoginHistory, updateLogoutTime} = require("../Model/loginHistory");

const { get } = require("mongoose");
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

    const role = await new Promise((resolve, reject) => {
      getRoleById(user.role_id, (err, role) => {
        if (err) {
          reject(err);
        } else {
          resolve(role);
        }
      });
    });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ details: errorCodes.INVALID_CREDENTIALS });
    }

    console.log("JWT Payload:", { 
      userId: user.student_id || user.manager_id, 
      username: user.first_name,
      role: role.role_name 
    });

    // Generate JWT token
    // change user_id to user.student_id or user.manager_id based on the role
    const token = jwt.sign({ userId: user.student_id || user.manager_id, username: user.first_name, role: role.role_name }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Attempt to store login history
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const deviceInfo = req.headers["user-agent"];
    //Save user login history
    createLoginHistory(userId, ip, deviceInfo, (err, result) => {
      if (err) {
        console.error("Error saving login history:", err);
      } else {
        console.log("Login history saved successfully:", result);
      }
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      role: role.role_name,
    });
  } catch (error) {
    console.error("Error during login process:", error);
    res.status(500).json({ details: { message: "An Unexpected Error Occurred" } });
  }
};

// Handle logout attempt
const logoutHandler = async (req, res) => {
  const { login_history_id } = req.body;

  try {
    // Update the logout time in login history
    updateLogoutTime(login_history_id, (err, result) => {
      if (err) {
        return res.status(500).json({ details: "Error updating logout time" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ details: "Login history not found" });
      }

      res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    console.error("Error during logout process:", error);
    res.status(500).json({ details: { message: "Logout failed" } });
  }
};

module.exports = {
  loginAttempt: loginAttemptHandler,
  logoutHandler: logoutHandler,
};

//console.log(loginHistory); // Add this to check if the model is correctly imported