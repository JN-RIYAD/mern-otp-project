// server/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();

// Create transporter using Gmail + App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

});

transporter.verify().then(() => {
  console.log("✅ Mailer ready (Gmail SMTP)");
}).catch(err => {
  console.error("❌ Mailer verify failed:", err);
});

// helper to generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// SIGNUP route
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const newUser = new User({
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });
    await newUser.save();

    // send OTP via Gmail
    const info = await transporter.sendMail({
      from: `"MERN OTP" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your verification OTP",
      text: `Your verification OTP is ${otp}. It expires in 5 minutes.`,
      html: `<p>Your verification OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });

    console.log("Sent OTP email:", info.messageId);
    res.json({ message: "User registered. OTP sent to email." });
  } catch (err) {
    console.error("Signup Error:", err);
    
    if (err && err.response && err.response.includes("535")) {
      return res.status(500).json({ message: "Email sending failed: authentication error (check app password)." });
    }
    res.status(500).json({ message: "Server error during signup" });
  }
});

// RESEND OTP route
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    const info = await transporter.sendMail({
      from: `"MERN OTP" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your new verification OTP",
      text: `Your new OTP is ${otp}. It expires in 5 minutes.`,
      html: `<p>Your new OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });

    console.log("Resent OTP email:", info.messageId);
    res.json({ message: "OTP resent to email." });
  } catch (err) {
    console.error("Resend OTP Error:", err);
    res.status(500).json({ message: "Server error while resending OTP" });
  }
});

// VERIFY OTP route
router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isVerified) return res.json({ message: "User already verified" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpires < Date.now()) return res.status(400).json({ message: "OTP has expired" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify Error:", err);
    res.status(500).json({ message: "Server error during verification" });
  }
});

module.exports = router;
