// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./Routes/authRoutes");
const profileRoutes = require("./Routes/profileRoutes");
const courseRoutes = require("./Routes/courseRoutes");
const programRoutes = require("./Routes/programRoutes");
const programCourseRoutes = require("./Routes/programCourseRoutes");
const gradeRoutes = require("./Routes/gradeRoutes"); // Add this line

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use auth routes
app.use("/api/auth", authRoutes);

// Use profile routes
app.use("/api", profileRoutes);

// Use course routes
app.use("/api", courseRoutes);

// Use program routes
app.use("/api", programRoutes);

// Use program course routes
app.use("/api", programCourseRoutes);

// Use grade routes
app.use("/api", gradeRoutes); // Add this line

// Start Server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});