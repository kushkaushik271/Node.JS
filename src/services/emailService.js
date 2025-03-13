const nodemailer = require("nodemailer");
require('dotenv').config()
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetPasswordEmail = async (email, resetToken) => {
  const resetLink = `${process.env.URL}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `<p>You requested a password reset. Click the link below to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>
           <p>If you didn't request this, please ignore this email.</p>`,
  };

  await transporter.sendMail(mailOptions);
};


const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.URL}/verify-email/${token}`;
  console.log({verificationLink})
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `<p>Thank you for signing up! Please verify your email by clicking the link below:</p>
           <a href="${verificationLink}">Verify Email</a>
           <p>If you did not sign up for this account, please ignore this email.</p>`,
  };
  console.log({mailOptions})
  await transporter.sendMail(mailOptions);
};


module.exports = { sendResetPasswordEmail, sendVerificationEmail };
