import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});
export const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.SMTP_USERNAME,
    to: options.to,
    cc: options.cc,
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
    attachments: options.attachments,
  };

  return transporter.sendMail(mailOptions);
};
