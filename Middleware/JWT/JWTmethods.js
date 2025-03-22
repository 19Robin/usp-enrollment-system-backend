const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

const generateToken = (userId, username, role) => {
  console.log(userId, role);
  const expiresIn = "2h";
  const payload = { userId, username, role };
  const token = jwt.sign(payload, secret, { expiresIn });

  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secret);
    console.log("Decoded:", decoded);
    return decoded;
  } catch (err) {
    console.error("Invalid or expired token:", err);
    throw new Error("Invalid or expired token");
  }
};

module.exports = { generateToken, verifyToken };