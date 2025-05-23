const express = require("express");
const { submitGraduationApplication } = require("../Controller/applicationController");
const router = express.Router();

router.post("/graduation", submitGraduationApplication);

module.exports = router;