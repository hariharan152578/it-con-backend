
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
import AbstractStatus from "../models/abstractStatusModel.js";
import { generateToken } from "../middleware/authMiddleware.js";
import { sendEmail } from "../config/email.js";
import { emailTemplate } from "../config/emailTemplate.js";
// ----------------------------
// Register User
// ----------------------------
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const emailExists = await User.findOne({ email });
  if (emailExists) return res.status(400).json({ message: "Email already exists" });

  const user = await User.create({ name, email, password });
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

    res.status(201).json({
      _id: user._id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// ----------------------------
// Login User
// ----------------------------
export const loginUser = asyncHandler(async (req, res) => {
  const { login, password } = req.body;
  const user = await User.findOne({ $or: [{ email: login }, { userId: login }] });

  if (!user) return res.status(400).json({ message: "Invalid email/userId" });
  if (!(await user.matchPassword(password))) return res.status(401).json({ message: "Invalid password" });

  res.json({
    _id: user._id,
    userId: user.userId,
    name: user.name,
    email: user.email,
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

  res.json({
    _id: user._id,
    userId: user.userId,
    name: user.name,
    email: user.email,
    abstractStatus: abstractStatus ? abstractStatus.abstractStatus : "pending",
    finalPaperStatus: abstractStatus ? abstractStatus.finalPaperStatus : "pending",
    paymentStatus: abstractStatus ? abstractStatus.paymentStatus : "pending",
  });
});

// ----------------------------
// Logout
// ----------------------------
export const logoutUser = asyncHandler(async (req, res) => {
  res.json({ message: "User logged out successfully" });
});
