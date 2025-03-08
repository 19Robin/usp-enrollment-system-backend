const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getStudentById } = require("../Model/studentModel");
const errorCodes = require("./errorCodes");

const loginAttemptHandler = async (req, res) => {
  const { studentId, password } = req.body;

  try {
    const student = await new Promise((resolve, reject) => {
      getStudentById(studentId, (err, student) => {
        if (err) {
          reject(err);
        } else {
          resolve(student);
        }
      });
    });

    if (!student) {
      return res.status(401).json({ details: errorCodes.INVALID_CREDENTIALS });
    }

    const passwordMatch = await bcrypt.compare(password, student.password);
    if (!passwordMatch) {
      return res.status(401).json({ details: errorCodes.INVALID_CREDENTIALS });
    }

    // Generate JWT token
    const token = jwt.sign({ studentId: student.student_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error("Error during login process:", error);
    res.status(500).json({ details: { message: "An Unexpected Error Occurred" } });
  }
};

module.exports = {
  loginAttempt: loginAttemptHandler,
};