require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./Routes/authRoutes");
const profileRoutes = require("./Routes/profileRoutes");
const courseRoutes = require("./Routes/courseRoutes");
const programRoutes = require("./Routes/programRoutes");
const programCourseRoutes = require("./Routes/programCourseRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", courseRoutes);
app.use("/api", programRoutes);
app.use("/api", programCourseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});