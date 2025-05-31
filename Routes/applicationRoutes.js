const express = require("express");
const { 
  submitGraduationApplication,
  submitCompassionateApplication,
  submitAegrotatApplication,
  submitSpecialExamApplication
} = require("../Controller/applicationController");
const router = express.Router();

router.post("/graduation", submitGraduationApplication);
router.post("/compassionate", submitCompassionateApplication);
router.post("/aegrotat", submitAegrotatApplication);
router.post("/special-exam", submitSpecialExamApplication);

module.exports = router;