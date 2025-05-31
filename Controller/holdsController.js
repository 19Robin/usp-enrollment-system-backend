const { financeDb } = require('../db');
const AppError = require("../appError");

const getHoldStatus = (studentId, res, next) => {

    const query = "SELECT hold_status FROM holds WHERE student_id = ?";

    financeDb.query(query, [studentId], (err, result) => {

        if (err) {
            console.error("Error fetching hold status:", err);
            //return res.status(500).json({ error: "Database error" });
            next(new AppError("DB_ERROR", "Error fetching hold status", 500));
        }

        if (result.length > 0) {
            return res.json({ hold_status: result[0].hold_status });
        } else {
            return res.json({ hold_status: "inactive" });
        }
    });

};

module.exports = { getHoldStatus };

