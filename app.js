const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authRoutes = require("./Routes/authRoutes");
const financeRoutes = require("./Routes/financeRoutes");
const app = express();
const path = require('path');
const fs = require('fs');
const jobs = require('./Model/jobs');
const errorHandler = require('./Middleware/errorHandler');

// middlewares
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({}));
app.use(express.json());
app.use(cookieParser());

// routes 
app.use("/api/auth", authRoutes);
app.use("/api/finance", financeRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send({details: { message: 'Something went wrong!'}});
// });

// test route
app.get("/", (req, res) => {
    res.status(200).send("Hello World\n");
});

app.get('/downloadFile', (req, res) => {
    const fileName = req.query.fileName; 

    const allowedDirectory = path.join(__dirname, 'Files', 'Requests');

    const resolvedFilePath = path.resolve(allowedDirectory, fileName);
    console.log("Resolved file path:", resolvedFilePath);

    if (!resolvedFilePath.startsWith(allowedDirectory)) {
        return res.status(400).json({ message: "Invalid file path" });
    }

    if (fs.existsSync(resolvedFilePath)) {
        res.download(resolvedFilePath, path.basename(resolvedFilePath), (err) => {
            if (err) {
                console.error("Error downloading file:", err);
                res.status(500).json({ message: "Error downloading file" });
            }
        });
    } else {
        res.status(404).json({ message: "File not found" });
    }
});

const schema = Joi.object({
    userID: Joi.number().required(),
})

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.statusCode || 500).json({ message: err.message || 'Internal server error.' });
});

//Register the error handler middleware
app.use(errorHandler);

module.exports = app;