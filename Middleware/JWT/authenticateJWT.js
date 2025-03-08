const { verifyToken } = require("./JWTmethods");
require("dotenv").config();

const authenticateUserJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Log the URL being accessed and request details based on the method
  console.log(`URL: ${req.method} ${req.originalUrl}`);

  // Log additional information based on request method
  if (req.method === "POST" || req.method === "PUT") {
    console.log("Request Body:", req.body);
  } else if (req.method === "GET") {
    console.log("Query Params:", req.query);
  }

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const user = verifyToken(token);
      console.log("User:", user);
      req.user = user;
      next();
    } catch (err) {
      console.error("Invalid or expired token:", err);
      return res.sendStatus(403); // Forbidden
    }
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

module.exports = authenticateUserJWT;
