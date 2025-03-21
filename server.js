require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./Routes/authRoutes");
const financeRoutes = require("./Routes/financeRoutes");
const { db, financeDb } = require("./db"); //Import DB connections

const app = express();
app.use(cors());
app.use(bodyParser.json());



// Use auth routes
app.use("/api/auth", authRoutes);
app.use("/api/finance", financeRoutes);

// **Start Server**
app.listen(5000, () => {
  console.log("Server running on port 5000");
});