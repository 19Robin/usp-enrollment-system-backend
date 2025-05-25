const nodemailer = require("nodemailer");

const sendEmailHandler = async (html, subject, to, cc) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_EMAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: {
        name: "usp-noreply",
        address: process.env.APP_EMAIL,
      },
      to: to,
      cc: cc || "",
      subject: subject,
      html: html,
    });

    console.log("Message sent: %s", info.messageId);
    return "Email Sent";
  } catch (error) {
    console.log("Error: ", error);
    return "Email Not Sent";
  }
};

module.exports = {
  sendEmailHandler,
};