const nodemailer = require("nodemailer");
require("dotenv").config();
const sendInterviewEmailController = async (req, res) => {
  const { to, inviteLink, interviewerName } = req.body;

  console.log("From sendInterviewEmailController");
  console.log("Request Body:", req.body);

  if (!to || !inviteLink) {
    const missingFields = [];
    if (!to) missingFields.push("to");
    if (!inviteLink) missingFields.push("inviteLink");

    return res.status(400).json({
      error: `Missing required field(s): ${missingFields.join(", ")}`,
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Interview Invitation",
      html: `
            <p>Hello, </p>
            <p>You have been invited to an interview by <strong>${interviewerName}</strong>.</p>
            <p>Click the link below to join: </p>
            <a href = "${inviteLink}">${inviteLink}</a>
            <p>Best regards, <br/>Conversational Agentic AI Team </p>
            `,
    });

    res.status(200).json({ message: "Email sent" });
  } catch (err) {
    console.log("Error from sendInterviewEmailController: ", err);
    res.status(500).json({ error: "Email sending failed" });
  }
};

module.exports = { sendInterviewEmailController };
