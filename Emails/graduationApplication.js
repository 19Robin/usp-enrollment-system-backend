const fs = require("fs");
const path = require("path");
const { sendEmailHandler } = require("./sendEmail");

const sendGraduationApplicationEmail = async (studentName, studentEmail) => {
  try {
    const templatePath = path.join(__dirname, "Views", "graduationApplication.html");
    let html = fs.readFileSync(templatePath, "utf8");
    html = html.replace("<%= student %>", studentName);

    await sendEmailHandler(
      html,
      "USP Graduation Application Received",
      studentEmail
    );
  } catch (err) {
    console.error("Failed to send graduation application email:", err);
  }
};

module.exports = { sendGraduationApplicationEmail };