


// import asyncHandler from "express-async-handler";
// import crypto from "crypto";
// import validator from "validator";
// import User from "../models/userModel.js";
// import Registration from "../models/registerModel.js";
// import AbstractStatus from "../models/abstractStatusModel.js";
// import { generateToken } from "../middleware/authMiddleware.js";
// import { sendEmail } from "../config/email.js";
// import emailTemplate from "../config/emailTemplate.js";
// import {countryCodeMap} from "../config/payment.js";



// // ----------------------------
// // Register User
// // ----------------------------
// export const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password, mobilenocountrycode, mobileno } = req.body;

//   if (!validator.isEmail(email)) return res.status(400).json({ message: "Invalid email" });

//   if (await User.findOne({ email })) return res.status(400).json({ message: "Email already exists" });
//   if (await User.findOne({ mobileno })) return res.status(400).json({ message: "Mobile number already exists" });

//   // Combine country code + number
// const fullNumber = `${mobilenocountrycode}${mobileno}`;
// let countryName = countryCodeMap[mobilenocountrycode] || "Unknown";

//   const user = await User.create({
//     name,
//     email,
//     password,
//     mobilenocountrycode,
//     mobileno,
//     country: countryName,
//   });

//   // Send welcome email
//   await sendEmail({
//     to: user.email,
//     subject: "Welcome to the Conference! 🎉",
//     html: emailTemplate(
//       "Welcome to the Conference 🎉",
//       `<p>Hello ${user.name}, your account has been created successfully!</p>
//        <p>Detected Country: <b>${countryName}</b></p>`,
//       user.name,
//       user.email,
//       user.userId
//     ),
//   });

//   res.status(201).json({
//     _id: user._id,
//     userId: user.userId,
//     name: user.name,
//     email: user.email,
//     mobileno: user.mobileno,
//     mobilenocountrycode: user.mobilenocountrycode,
//     country: user.country,
//   });
// });

// // ----------------------------
// // Login User
// // ----------------------------
// export const loginUser = asyncHandler(async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({
//     $or: [{ email: username }, { mobileno: username }, { userId: username }],
//   });
//   if (!user) return res.status(404).json({ message: "Invalid username" });

//   if (!(await user.matchPassword(password))) {
//     return res.status(401).json({ message: "Invalid password" });
//   }

//   res.json({
//     _id: user._id,
//     userId: user.userId,
//     token: generateToken(user._id),
//   });
// });

// // ----------------------------
// // Request Password OTP
// // ----------------------------
// export const requestPasswordOtp = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   console.log(user);
  
//   if (!user) return res.status(404).json({ message: "User not found" });

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

//   user.resetPasswordToken = otpHash;
//   user.resetPasswordExpire = Date.now() + 1 * 60 * 1000; // 10 min
//   await user.save();
//   await sendEmail({
//   to: user.email,
//   subject: "🔐 Your OTP Code",
//   html:emailTemplate(
//     "OTP Verification",                        // title
//     `<p>Hello ${user.name},</p>
//      <p>Please use the following OTP to verify your action:</p>

//      <p>This OTP is valid for 1 minutes.</p>`, // message/body
//     user.name,                                 // userName
//     user.email,                                // userEmail
//     user.userId,                               // userId
//     undefined,                                 // userAbstract
//     undefined,                                 // finalPaperStatus
//     undefined,                                 // paymentStatus
//     undefined, 
//     otp
//   )
//   });
//   res.json({ message: "OTP sent to email" });
// });

// // ----------------------------
// // Verify OTP & Reset Password
// // ----------------------------
// export const verifyOtp = asyncHandler(async (req, res) => {
//   const { email, otp, newPassword } = req.body;
//    const useremail = await User.findOne({ email });
//   if (!useremail) return res.status(404).json({ message: "User not found" });

//   if (!email || !otp || !newPassword)
//     return res.status(400).json({ message: "email, otp and newPassword are required" });

//   const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
//   const user = await User.findOne({
//     email,
//     resetPasswordToken: otpHash,
//     resetPasswordExpire: { $gt: Date.now() },
//   });
//   if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

//   user.password = newPassword;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;
//   await user.save();

//   await sendEmail({
//    to: user.email,
//   subject: "Password Changed ✅",
//   html: `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; border-radius: 10px; overflow: hidden;">
//       <div style="background-color: #2563eb; color: white; padding: 15px 20px; text-align: center;">
//         <h2>Password Changed Successfully</h2>
//       </div>
//       <div style="padding: 20px; color: #333;">
//         <p>Hello <b>${user.name}</b>,</p>
//         <p>Your password has been updated successfully.</p>
//         <p>If you did not perform this action, please contact our support team immediately.</p>
//       </div>
//       <div style="background-color: #eee; padding: 10px; text-align: center; font-size: 12px; color: #666;">
//         <p>© ${new Date().getFullYear()} Conference Team</p>
//       </div>
//     </div>
//   `,
//   });

//   res.status(200).json({ message: "Password updated successfully" });
// });



// export const getMe = asyncHandler(async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const registration = await Registration.findOne({ userId: user._id });
//     const abstractStatus = await AbstractStatus.findOne({ userId: user._id });
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       mobileno: user.mobileno,
//       discount: abstractStatus ? abstractStatus.discount : false,
//       abstractStatus: registration ? user.abstractStatus : "No Abstract",
//       paperStatus: registration ? user.paperStatus : "No Paper",
//       paymentStatus: registration ? user.paymentStatus : "Unpaid",
//       participants: registration ? registration.participants : [],
//       presentationMode: registration ? registration.presentationMode : "Not specified",
//       accommodation:registration?registration.accommodation:"False",
//       paymentprocess: registration.payment
//     });
//   } catch (error) {
//     console.error("Get Profile Error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// export const logoutUser = asyncHandler(async (req, res) => {
//   try {
//     res.json({ message: "User logged out successfully" });
//   } catch (error) {
//     console.error("Logout Error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

import asyncHandler from "express-async-handler";
import crypto from "crypto";
import validator from "validator";
import User from "../models/userModel.js";
import Registration from "../models/registerModel.js";
import AbstractStatus from "../models/abstractStatusModel.js";
import { generateToken } from "../middleware/authMiddleware.js";
import { sendEmail } from "../config/email.js";
import emailTemplate from "../config/emailTemplate.js";
import { countryCodeMap } from "../config/payment.js";

/* =====================================================
   REGISTER USER
===================================================== */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, mobilenocountrycode, mobileno } = req.body;

  // ✅ Validate email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  // ✅ Check if user already exists
  if (await User.findOne({ email })) {
    return res.status(400).json({ message: "Email already exists" });
  }

  if (await User.findOne({ mobileno })) {
    return res.status(400).json({ message: "Mobile number already exists" });
  }

  // ✅ Get country name
  const countryName = countryCodeMap[mobilenocountrycode] || "Unknown";

  // ✅ Create user
  const user = await User.create({
    name,
    email,
    password,
    mobilenocountrycode,
    mobileno,
    country: countryName,
  });

  // ✅ Send welcome email
  await sendEmail({
    to: user.email,
    subject: "Welcome to the Conference! 🎉",
    html: emailTemplate(
      "Welcome to the Conference 🎉",
      `<p>Hello ${user.name}, your account has been created successfully!</p>
       <p>Detected Country: <b>${countryName}</b></p>`,
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
    mobilenocountrycode: user.mobilenocountrycode,
    country: user.country,
  });
});

/* =====================================================
   LOGIN USER
===================================================== */
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: username }, { mobileno: username }, { userId: username }],
  });

  if (!user) return res.status(404).json({ message: "Invalid username" });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  res.json({
    _id: user._id,
    userId: user.userId,
    token: generateToken(user._id),
  });
});

/* =====================================================
   REQUEST PASSWORD OTP
===================================================== */
export const requestPasswordOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // ✅ Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  // ✅ Set token + 1 minute expiry
  user.resetPasswordToken = otpHash;
  user.resetPasswordExpire = Date.now() + 1 * 60 * 1000; // 1 minute
  await user.save();

  // ✅ Send OTP via email
  await sendEmail({
    to: user.email,
    subject: "🔐 Your OTP Code",
    html: emailTemplate(
      "OTP Verification",
      `<p>Hello ${user.name},</p>
       <p>Please use the following OTP to verify your action:</p>
       <h2 style="text-align:center;letter-spacing:3px;">${otp}</h2>
       <p>This OTP is valid for <b>1 minute</b>.</p>`,
      user.name,
      user.email,
      user.userId,
      undefined,
      undefined,
      undefined,
      undefined,
      otp
    ),
  });

  res.json({ message: "OTP sent to email successfully" });
});

/* =====================================================
   VERIFY OTP & RESET PASSWORD
===================================================== */
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP, and newPassword are required" });
  }

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await User.findOne({
    email,
    resetPasswordToken: otpHash,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // ✅ Send confirmation email
  await sendEmail({
    to: user.email,
    subject: "Password Changed ✅",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; border-radius: 10px;">
        <div style="background-color: #2563eb; color: white; padding: 15px 20px; text-align: center;">
          <h2>Password Changed Successfully</h2>
        </div>
        <div style="padding: 20px; color: #333;">
          <p>Hello <b>${user.name}</b>,</p>
          <p>Your password has been updated successfully.</p>
          <p>If you did not perform this action, please contact our support team immediately.</p>
        </div>
        <div style="background-color: #eee; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} Conference Team</p>
        </div>
      </div>
    `,
  });

  res.status(200).json({ message: "Password updated successfully" });
});

/* =====================================================
   GET CURRENT USER PROFILE
===================================================== */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  const registration = await Registration.findOne({ userId: user._id });
  const abstractStatus = await AbstractStatus.findOne({ userId: user._id });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    mobileno: user.mobileno,
    discount: abstractStatus ? abstractStatus.discount : false,
    abstractStatus: registration ? user.abstractStatus : "No Abstract",
    paperStatus: registration ? user.paperStatus : "No Paper",
    paymentStatus: registration ? user.paymentStatus : "Unpaid",
    participants: registration ? registration.participants : [],
    presentationMode: registration ? registration.presentationMode : "Not specified",
    accommodation: registration ? registration.accommodation : "False",
    paymentProcess: registration?.payment || null,
  });
});

/* =====================================================
   LOGOUT USER
===================================================== */
export const logoutUser = asyncHandler(async (req, res) => {
  res.json({ message: "User logged out successfully" });
});
