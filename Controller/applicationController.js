const { 
  createGraduationApplicationInDB, 
  saveGraduationApplication, 
  getStudentInfo, 
  saveExamApplication,
  getAllStudentApplications
} = require("../Model/applicationModel");
const { 
  sendGraduationApplicationEmail,
  sendCompassionatePassApplicationEmail,
  sendAegrotatPassApplicationEmail,
  sendSpecialExamApplicationEmail
} = require("../Emails/application");

function parseExamTime(timeStr) {
  // Converts '10am', '9am', '2pm', '10:30am', etc. to 'HH:MM:SS'
  if (!timeStr) return null;
  let match = timeStr.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!match) return timeStr; // fallback, may error in DB
  let hour = parseInt(match[1], 10);
  let minute = match[2] ? parseInt(match[2], 10) : 0;
  let period = match[3] ? match[3].toLowerCase() : null;
  if (period === 'pm' && hour < 12) hour += 12;
  if (period === 'am' && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
}

function parseExamDate(dateStr) {
  // Converts DD/MM/YY or DD/MM/YYYY to YYYY-MM-DD
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  let year = parts[2];
  if (year.length === 2) year = '20' + year;
  return `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
}

// Graduation Application
const submitGraduationApplication = async (req, res) => {
  const { studentId, applicationData } = req.body;
  if (!studentId || !applicationData) {
    return res.status(400).json({ message: "Missing studentId or applicationData" });
  }

  try {
    // 1. Create a new application in the applications table
    const appId = await createGraduationApplicationInDB(studentId);

    // 2. Save the graduation application details
    await saveGraduationApplication(studentId);

    // 3. Send notification email
    const student = await getStudentInfo(studentId);
    if (student && student.email) {
      await sendGraduationApplicationEmail(student.name, student.email);
    }
    res.status(201).json({ message: "Graduation application submitted and notification sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit graduation application." });
  }
};

// Helper for exam-related applications
const submitExamApplication = (applicationTypeId, sendEmailFn) => async (req, res) => {
  console.log("Received exam application:", req.body); // Debug log
  const { studentId, reason, courseId, examDate, examTime, supportingDocsUrl } = req.body;
  if (!studentId || !reason || !courseId) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const parsedExamDate = parseExamDate(examDate);
    const parsedExamTime = parseExamTime(examTime); // <-- Make sure this is here!
    console.log("Saving with exam_time:", parsedExamTime); // <-- Add this debug log

    await saveExamApplication(
      studentId,
      applicationTypeId,
      1,
      reason,
      courseId,
      parsedExamDate,
      parsedExamTime, // <-- Make sure this is parsedExamTime, NOT examTime!
      supportingDocsUrl
    );
    try {
      const student = await getStudentInfo(studentId);
      if (student && student.email) {
        await sendEmailFn(student.name, student.email);
      }
    } catch (emailErr) {
      console.error("Warning: Application saved but failed to send email:", emailErr);
    }
    res.status(201).json({ message: "Application submitted. Notification sent if possible." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit application." });
  }
};

const getStudentApplications = async (req, res) => {
  const studentId = req.query.studentId;
  if (!studentId) {
    return res.status(400).json({ message: "Missing studentId" });
  }
  try {
    const apps = await getAllStudentApplications(studentId);
    res.json(apps);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// Set your application_type_id values as needed
const submitCompassionateApplication = submitExamApplication(3, sendCompassionatePassApplicationEmail);
const submitAegrotatApplication = submitExamApplication(4, sendAegrotatPassApplicationEmail);
const submitSpecialExamApplication = submitExamApplication(5, sendSpecialExamApplicationEmail);

module.exports = {
  submitGraduationApplication,
  submitCompassionateApplication,
  submitAegrotatApplication,
  submitSpecialExamApplication,
  getStudentApplications
};