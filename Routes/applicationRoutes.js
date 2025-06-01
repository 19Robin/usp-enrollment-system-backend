const express = require("express");
const { 
  getAllApplications,
  submitGraduationApplication,
  submitCompassionateApplication,
  submitAegrotatApplication,
  submitSpecialExamApplication,
  getStudentApplications
} = require("../Controller/applicationController");
const router = express.Router();

router.get("/view-all-applications/:studentId", getAllApplications);
//router.get("/view-application-details/:applicationId", getApplicationDetails);

router.post("/graduation", submitGraduationApplication);
router.post("/compassionate", submitCompassionateApplication);
router.post("/aegrotat", submitAegrotatApplication);
router.post("/special-exam", submitSpecialExamApplication);
router.get("/", getStudentApplications);

module.exports = router;