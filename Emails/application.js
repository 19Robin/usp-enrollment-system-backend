const fs = require("fs");
const path = require("path");
const { sendEmailHandler } = require("./sendEmail");

// Helper to load and fill template
function loadTemplate(templateName, studentName) {
  const templatePath = path.join(__dirname, "Views", templateName);
  let html = fs.readFileSync(templatePath, "utf8");
  return html.replace("<%= student %>", studentName);
}

// Graduation Application Notification
const sendGraduationApplicationEmail = async (studentName, studentEmail) => {
  try {
    const html = loadTemplate("graduationApplication.html", studentName);
    await sendEmailHandler(
      html,
      "USP Graduation Application Received",
      studentEmail
    );
  } catch (err) {
    console.error("Failed to send graduation application email:", err);
  }
};

// Grade Recheck Notification
const sendGradeRecheckApplicationEmail = async (studentName, studentEmail) => {
  try {
    const html = loadTemplate("gradeRecheckApplication.html", studentName);
    await sendEmailHandler(
      html,
      "USP Grade Recheck Application Received",
      studentEmail
    );
  } catch (err) {
    console.error("Failed to send grade recheck application email:", err);
  }
};

// Aegrotat Pass Notification
const sendAegrotatPassApplicationEmail = async (studentName, studentEmail) => {
  try {
    const html = loadTemplate("aegrotatPassApplication.html", studentName);
    await sendEmailHandler(
      html,
      "USP Aegrotat Pass Application Received",
      studentEmail
    );
  } catch (err) {
    console.error("Failed to send aegrotat pass application email:", err);
  }
};

// Compassionate Pass Notification
const sendCompassionatePassApplicationEmail = async (studentName, studentEmail) => {
  try {
    const html = loadTemplate("compassionatePassApplication.html", studentName);
    await sendEmailHandler(
      html,
      "USP Compassionate Pass Application Received",
      studentEmail
    );
  } catch (err) {
    console.error("Failed to send compassionate pass application email:", err);
  }
};

// Special Exam Notification
const sendSpecialExamApplicationEmail = async (studentName, studentEmail) => {
  try {
    const html = loadTemplate("specialExamApplication.html", studentName);
    await sendEmailHandler(
      html,
      "USP Special Exam Application Received",
      studentEmail
    );
  } catch (err) {
    console.error("Failed to send special exam application email:", err);
  }
};

module.exports = {
  sendGraduationApplicationEmail,
  sendGradeRecheckApplicationEmail,
  sendAegrotatPassApplicationEmail,
  sendCompassionatePassApplicationEmail,
  sendSpecialExamApplicationEmail,
};