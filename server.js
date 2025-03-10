require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./Routes/authRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Bishops_2025",
  database: process.env.DB_NAME || "usp_enrol_system",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.message);
  } else {
    console.log("");
  }
});

// Use auth routes
app.use("/api/auth", authRoutes);

// **Start Server**
app.listen(5000, () => {
  console.log("Server running on port 5000");
});