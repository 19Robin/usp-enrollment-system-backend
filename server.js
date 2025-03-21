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

app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", courseRoutes);
app.use("/api", programRoutes);
app.use("/api", programCourseRoutes);

<<<<<<< HEAD
// Use grade routes
app.use("/api", gradeRoutes); // Add this line

// Start Server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
=======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
>>>>>>> 9adddd137eb7c0611948157fd821eabfa62cf14a
});