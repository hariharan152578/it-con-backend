
// import asyncHandler from "express-async-handler";
// import User from "../models/userModel.js";
// import { generateToken } from "../middleware/authMiddleware.js";
// import AbstractStatus from "../models/abstractStatusModel.js";
// // Register
// export const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;

//   const emailExists = await User.findOne({ email });
//   if (emailExists) {
//     return res.status(400).json({ message: "Email already exists" });
//   }

//   const user = await User.create({ name, email, password });

//   if (user) {
//     res.status(201).json({
//       _id: user._id,
//       userId: user.userId,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(400).json({ message: "Invalid user data" });
//   }
// });

// // Login
// export const loginUser = asyncHandler(async (req, res) => {
//   const { login, password } = req.body;

//   const user = await User.findOne({
//     $or: [{ email: login }, { userId: login }],
//   });

//   if (!user) return res.status(400).json({ message: "Invalid email/userId" });

//   if (!(await user.matchPassword(password)))
//     return res.status(401).json({ message: "Invalid password" });

//   res.json({
//     _id: user._id,
//     userId: user.userId,
//     name: user.name,
//     email: user.email,
//     token: generateToken(user._id),
//   });
// });

// // Get profile

// export const getMe = asyncHandler(async (req, res) => {
//   // Fetch user
//   const user = await User.findById(req.user.id).select("-password");
//   if (!user) return res.status(404).json({ message: "User not found" });

//   // Fetch status
//   const abstractStatus = await AbstractStatus.findOne({ userId: user._id });

//   res.json({
//     _id: user._id,
//     userId: user.userId,
//     name: user.name,
//     email: user.email,

//     // Workflow comes from AbstractStatus collection
//     abstractStatus: abstractStatus ? abstractStatus.abstractStatus : "pending",
//     finalPaperStatus: abstractStatus ? abstractStatus.finalPaperStatus : "pending",
//     paymentStatus: abstractStatus ? abstractStatus.paymentStatus : "pending",
//   });
// });
// // Logout
// export const logoutUser = asyncHandler(async (req, res) => {
//   res.json({ message: "User logged out successfully" });
// });

import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import AbstractStatus from "../models/abstractStatusModel.js";
import { generateToken } from "../middleware/authMiddleware.js";
import { sendEmail } from "../config/email.js";
import { emailTemplate } from "../config/emailTemplate.js";
import Registration from "../models/registerModel.js"; // Make sure to import your Registration model
// ----------------------------
// Register User
// ----------------------------
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password,mobileno } = req.body;
  const emailExists = await User.findOne({ email });
  const mobileExists = await User.findOne({ mobileno})
  if (emailExists) return res.status(400).json({ message: "Email already exists" });
  if (mobileExists) return res.status(400).json({ message: "Mobile number already exists" });
  const user = await User.create({ name, email, password, mobileno});
  if (!user) return res.status(400).json({ message: "Invalid user data" });
  if (user) {
    
    // Send email with UserID 
// await sendEmail({
//   to: user.email,
//   subject: "Welcome to the Conference!",
//   text: `Hello ${user.name}, your account has been created successfully. User ID: ${user.userId}`,
//   html: emailTemplate(
//     "Welcome to the Conference 🎉",
//     `Your account has been created successfully.<br/><br/>
//      <b>User ID:</b> ${user.userId}<br/>
//      Please keep this safe for your records.`,
//     user.name
//   ),
// });


// await sendEmail({
//   to: user.email,
//   subject: "Welcome to the Conference! 🎉",
//   html: emailTemplate(
//     `  <tr>
//                       <td align="center">
//                         <img src="https://www.google.com/imgres?q=ksr&imgurl=https%3A%2F%2Flookaside.fbsbx.com%2Flookaside%2Fcrawler%2Fmedia%2F%3Fmedia_id%3D2082249322122203&imgrefurl=https%3A%2F%2Fwww.facebook.com%2Fksr.educational.institutions%2F&docid=2_0MNXF2wu9lUM&tbnid=MceewFaVy1QzxM&vet=12ahUKEwjf64OQvM2PAxXK2TgGHf1yKC8QM3oECCYQAA..i&w=1024&h=389&hcb=2&ved=2ahUKEwjf64OQvM2PAxXK2TgGHf1yKC8QM3oECCYQAA"
//                              alt="KSR College of Engineering Banner"
//                              style="width:100%; max-width:600px; height:auto; display:block; border-radius:8px 8px 0 0;" />
//                       </td>
//                     </tr>`,
//     "Welcome to the Conference 🎉",
//     `
//       <p>Your account has been created successfully. Welcome aboard!</p>
//       <p>We're excited to have you as part of our community. Please keep your user details safe and secure for all future correspondence.</p>
//        <p style="margin-top: 20px;">
//                           <b>User Name:</b> ${user.name}<br/>
//                           <b>User Email:</b> ${user.email}<br/>
//                           <b>User ID:</b> ${user.userId}<br/>
//                         </p>
//     `,
//   ),
// });

await sendEmail({
  to: user.email,
  subject: "Welcome to the Conference! 🎉",
  html: emailTemplate(
    "Welcome to the Conference 🎉",
    `
      <p>Your account has been created successfully. Welcome aboard!</p>
      <p>We're excited to have you as part of our community. Please keep your user details safe and secure for all future correspondence.</p>
    `,
    user.name,
    user.email,
    user.userId
  ),
});
}
    res.status(201).json({
      _id: user._id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      mobileno:user.mobileno
    });
  
});

// ----------------------------
// Login User
// ----------------------------
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    $or: [
      { email: username },
      { mobileno: username },
      { userId: username }
    ]
  });
  if (!user) return res.status(400).json({ message: "Invalid username" });
  if (!(await user.matchPassword(password))) return res.status(401).json({ message: "Invalid password" });

  res.json({
    _id: user._id,
    userId: user.userId,
    name: user.name,
    email: user.email,
    mobileno: user.mobileno,
    token: generateToken(user._id),
  });
});

// ----------------------------
// Get Profile (Me)
// ----------------------------
// export const getMe = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user.id).select("-password");
//   if (!user) return res.status(404).json({ message: "User not found" });

//   const abstractStatus = await AbstractStatus.findOne({ userId: user._id });

//   res.json({
//     _id: user._id,
//     userId: user.userId,
//     name: user.name,
//     email: user.email,
//     mobileno: user.mobileno,
//     abstractStatus: abstractStatus ? abstractStatus.abstractStatus : "pending",
//     finalPaperStatus: abstractStatus ? abstractStatus.finalPaperStatus : "pending",
//     paymentStatus: abstractStatus ? abstractStatus.paymentStatus : "pending",
//   });
// });


export const getMe = asyncHandler(async (req, res) => {
  // Fetch user
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  // Fetch abstract & final paper status
  const abstractStatus = await AbstractStatus.findOne({ userId: user._id });

  // Fetch registration/participants data
  const registration = await Registration.findOne({ userId: user._id });

  res.json({
    _id: user._id,
    userId: user.userId,
    name: user.name,
    email: user.email,
    mobileno: user.mobileno,
    abstractStatus: abstractStatus ? abstractStatus.abstractStatus : "pending",
    finalPaperStatus: abstractStatus ? abstractStatus.finalPaperStatus : "pending",
    paymentStatus: abstractStatus ? abstractStatus.paymentStatus : "pending",
    participants: registration ? registration.participants : [], // Include participants if available
    presentationMode: registration ? registration.presentationMode : "Not specified" // Include presentation mode if available
  });
});

// 🟢 Step 1: Request reset password

export const requestPasswordOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP before saving
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  user.resetPasswordToken = otpHash;
  user.resetPasswordExpire = Date.now() + 1 * 60 * 1000; // valid for 10 min
  await user.save();

  // Send OTP email
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
// 🟢 Step 2: Reset password
// 🟢 Step 2: Verify OTP & send new password
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "email, otp and newPassword required" });
  }

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await User.findOne({
    email,
    resetPasswordToken: otpHash,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // Hash and save the new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  // Clear OTP fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
   
  await user.save();

  // Optionally send confirmation email (do NOT send the password)
  await sendEmail({
    to: user.email,
    subject: "Password Changed",
    html: `
      <h2>Password Changed</h2>
      <p>Hello ${user.name || user.email},</p>
      <p>Your password was changed successfully. If you did not perform this action, contact support immediately.</p>
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
