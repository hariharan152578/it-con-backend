import asyncHandler from "express-async-handler";
import crypto from "crypto";
import validator from "validator";
import User from "../models/userModel.js";
import AbstractStatus from "../models/abstractStatusModel.js";
import Registration from "../models/registerModel.js";
import { generateToken } from "../middleware/authMiddleware.js";
import { sendEmail } from "../config/email.js";
import { emailTemplate } from "../config/emailTemplate.js";

// ----------------------------
// Register User
// ----------------------------
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, mobileno } = req.body;

  // Check existing email/mobile
  if (await User.findOne({ email })) {
    return res.status(400).json({ message: "Email already exists" });
  }
  if (await User.findOne({ mobileno })) {
    return res.status(400).json({ message: "Mobile number already exists" });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email" });
  }

  // Create user (password hashing handled in schema pre-save hook)
  const user = await User.create({ name, email, password, mobileno });
  if (!user) return res.status(400).json({ message: "Invalid user data" });

  // Send welcome email
  await sendEmail({
    to: user.email,
    subject: "Welcome to the Conference! 🎉",
    html: emailTemplate(
      "Welcome to the Conference 🎉",
      `
        <p>Your account has been created successfully. Welcome aboard!</p>
        <p>We're excited to have you as part of our community. Please keep your user details safe.</p>
      `,
      user.name,
      user.email,
      user.userId
    ),
  });

  res.status(201).json({
    _id: user._id,
    userId: user.userId,
    name: user.name,
    email: user.email,
    mobileno: user.mobileno,
  });
});

// ----------------------------
// Login User
// ----------------------------
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Find by email, mobile, or userId
  const user = await User.findOne({
    $or: [{ email: username }, { mobileno: username }, { userId: username }],
  });
  if (!user) return res.status(404).json({ message: "Invalid username" });

  // Check password
  if (!(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid password" });
  }

  res.json({
    _id: user._id,
    userId: user.userId,
    token: generateToken(user._id),
  });
});

// ----------------------------
// Get Profile (Me)
// ----------------------------
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  const abstractStatus = await AbstractStatus.findOne({ userId: user._id });
  const registration = await Registration.findOne({ userId: user._id });

  res.json({
    _id: user._id,
    userId: user.userId,
    name: user.name,
    email: user.email,
    mobileno: user.mobileno,
    abstractStatus: abstractStatus ? abstractStatus.abstractStatus : "No Data",
    paperStatus: abstractStatus ? abstractStatus.paperStatus : "pending",
    paymentStatus: abstractStatus ? abstractStatus.paymentStatus : "pending",
    participants: registration ? registration.participants : [],
    presentationMode: registration ? registration.presentationMode : "Not specified",
  });
});

// ----------------------------
// Request OTP for Password Reset
// ----------------------------
export const requestPasswordOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP before saving
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  user.resetPasswordToken = otpHash;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Send OTP via email
  await sendEmail({
    to: user.email,
    subject: "Password Reset OTP",
    html: `
      <h2>Password Reset Request</h2>
      <p>Hello ${user.name || user.email},</p>
      <p>Your OTP to reset your password is:</p>
      <h3 style="color:#2563eb;">${otp}</h3>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  });

  res.json({ message: "OTP sent to email" });
});

// ----------------------------
// Verify OTP & Reset Password
// ----------------------------
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Validate input
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "email, otp and newPassword are required" });
  }

  // OTP must be 6 digits
  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ message: "OTP must be a 6-digit number" });
  }

  // Hash OTP
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  // Validate user with OTP
  const user = await User.findOne({
    email,
    resetPasswordToken: otpHash,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

  // Set new password (hashing handled in schema)
  user.password = newPassword;

  // Clear OTP fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // Send confirmation email
  await sendEmail({
    to: user.email,
    subject: "Password Changed",
    html: `
      <h2>Password Changed</h2>
      <p>Hello ${user.name || user.email},</p>
      <p>Your password was changed successfully. If this wasn’t you, please contact support immediately.</p>
    `,
  });

  res.status(200).json({ message: "Password updated successfully" });
});

// ----------------------------
// Logout
// ----------------------------
export const logoutUser = asyncHandler(async (req, res) => {
  res.json({ message: "User logged out successfully" });
});
