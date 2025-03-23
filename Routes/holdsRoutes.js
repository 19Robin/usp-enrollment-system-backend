const express = require("express");
const router = express.Router();
const { getHoldStatus } = require("../Controller/holdsController");

router.get("/:studentId", (req, res) => {
    const studentId = req.params.studentId;
    getHoldStatus(studentId, res);
});

module.exports = router; 