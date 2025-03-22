require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./Routes/authRoutes");
<<<<<<< HEAD
const financeRoutes = require("./Routes/financeRoutes");
const { db, financeDb } = require("./db"); //Import DB connections
=======
const profileRoutes = require("./Routes/profileRoutes");
const courseRoutes = require("./Routes/courseRoutes");
const programRoutes = require("./Routes/programRoutes");
const programCourseRoutes = require("./Routes/programCourseRoutes");
const gradesRoutes = require("./Routes/gradesRoutes"); // Add this line
>>>>>>> origin/main

const app = express();

app.use(cors());
app.use(bodyParser.json());

<<<<<<< HEAD


// Use auth routes
app.use("/api/auth", authRoutes);
app.use("/api/finance", financeRoutes);
=======
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", courseRoutes);
app.use("/api", programRoutes);
app.use("/api", programCourseRoutes);
app.use("/api", gradesRoutes); // Add this line
>>>>>>> origin/main

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});