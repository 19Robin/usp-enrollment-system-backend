const { createGraduationApplicationInDB, saveGraduationApplication, getStudentInfo } = require("../Model/applicationModel");
const { sendGraduationApplicationEmail } = require("../Emails/graduationApplication");

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

module.exports = { submitGraduationApplication };