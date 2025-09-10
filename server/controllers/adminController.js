// import asyncHandler from "express-async-handler";
// import User from "../models/userModel.js";
// import Admin from "../models/adminModel.js";
// import AbstractStatus from "../models/abstractStatusModel.js"; // ✅ your schema file
// // import Registration from "../models/registrationModel.js"; // ✅ your schema file
// import { generateToken } from "../middleware/authMiddleware.js";
// // Admin Signup
// export const registerAdmin = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;

//   const adminExists = await Admin.findOne({ email });
//   if (adminExists) return res.status(400).json({ message: "Admin already exists" });

//   const admin = await Admin.create({ name, email, password });

//   if (admin) {
//     res.status(201).json({
//       _id: admin._id,
//       name: admin.name,
//       email: admin.email,
//       token: generateToken(admin._id),
//     });
//   } else {
//     res.status(400).json({ message: "Invalid admin data" });
//   }
// });

// // Admin Login
// export const loginAdmin = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   const admin = await Admin.findOne({ email });

//   if (admin && (await admin.matchPassword(password))) {
//     res.json({
//       _id: admin._id,
//       name: admin.name,
//       email: admin.email,
//       isAdmin: admin.isAdmin,
//       token: generateToken(admin._id),
//     });
//   } else {
//     res.status(401).json({ message: "Invalid email or password" });
//   }
// });



// // Get a single user by ID (Admin view)
// export const getUserById = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id).select("-password");
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   res.json(user);
// });



// // Update user's approval workflow


// export const updateUserApproval = asyncHandler(async (req, res) => {
//   const { id } = req.params; // User ID
//   const { abstractStatus, finalPaperStatus, paymentStatus } = req.body;

//   const status = await AbstractStatus.findOne({ userId: id }).populate("userId", "name email");
//   if (!status) return res.status(404).json({ message: "Status record not found" });

//   // Step 1: Abstract
//   if (abstractStatus) {
//     status.abstractStatus = abstractStatus;
//     status.abstractApprovedBy = req.user._id;

//     await User.findByIdAndUpdate(id, { abstractStatus });
//     await Registration.findOneAndUpdate({ userId: id }, { abstractStatus });

//     if (abstractStatus === "rejected") {
//       status.finalPaperStatus = "pending";
//       status.finalPaperApprovedBy = null;
//       status.paymentStatus = "pending";
//       status.paymentApprovedBy = null;

//       await User.findByIdAndUpdate(id, { finalPaperStatus: "pending", paymentStatus: "unpaid" });
//       await Registration.findOneAndUpdate({ userId: id }, { finalPaperStatus: "pending", paymentStatus: "unpaid" });
//     }
//   }

//   // Step 2: Final Paper
//   if (finalPaperStatus) {
//     if (status.abstractStatus !== "approved") return res.status(400).json({ message: "Final paper cannot be updated before Abstract approval" });
//     status.finalPaperStatus = finalPaperStatus;
//     status.paperApprovedBy = req.user._id;

//     await User.findByIdAndUpdate(id, { finalPaperStatus });
//     await Registration.findOneAndUpdate({ userId: id }, { finalPaperStatus });

//     if (finalPaperStatus === "rejected") {
//       status.paymentStatus = "pending";
//       status.paymentApprovedBy = null;
//       await User.findByIdAndUpdate(id, { paymentStatus: "unpaid" });
//       await Registration.findOneAndUpdate({ userId: id }, { paymentStatus: "unpaid" });
//     }
//   }

//   // Step 3: Payment
//   if (paymentStatus) {
//     if (status.finalPaperStatus !== "approved") return res.status(400).json({ message: "Payment cannot be updated before Final Paper approval" });
//     status.paymentStatus = paymentStatus;
//     status.paymentApprovedBy = req.user._id;

//     await User.findByIdAndUpdate(id, { paymentStatus });
//     await Registration.findOneAndUpdate({ userId: id }, { paymentStatus });
//   }

//   const updatedStatus = await status.save();
//   res.json(updatedStatus);
// });
// // Get all users (Admin Dashboard)
// export const getAllUsers = asyncHandler(async (req, res) => {
//   const users = await User.find().select("-password");
//   res.json(users);
// });


import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import AbstractStatus from "../models/abstractStatusModel.js";
import Registration from "../models/registerModel.js";
import { generateToken } from "../middleware/authMiddleware.js";
import { sendEmail } from "../config/email.js";
import { emailTemplate } from "../config/emailTemplate.js";
// ----------------------------
// Register Admin
// ----------------------------
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const adminExists = await Admin.findOne({ email });
  if (adminExists) return res.status(400).json({ message: "Admin already exists" });

  const admin = await Admin.create({ name, email, password });
  if (admin) {
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400).json({ message: "Invalid admin data" });
  }
});

// ----------------------------
// Login Admin
// ----------------------------
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// ----------------------------
// Get all users
// ----------------------------
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// ----------------------------
// Get user by ID
// ----------------------------
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// ----------------------------
// Update User Approval Workflow
// ----------------------------
// export const updateUserApproval = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { abstractStatus, finalPaperStatus, paymentStatus } = req.body;

//   const status = await AbstractStatus.findOne({ userId: id }).populate("userId", "name email");
//   if (!status) return res.status(404).json({ message: "Status record not found" });

//   // Abstract workflow
//   if (abstractStatus) {
//     status.abstractStatus = abstractStatus;
//     status.abstractApprovedBy = req.user._id;
//     await User.findByIdAndUpdate(id, { abstractStatus });
//     await Registration.findOneAndUpdate({ userId: id }, { abstractStatus });
//   // Send email
//     // await sendEmail({
//     //   to: user.email,
//     //   subject: `Abstract ${abstractStatus}`,
//     //   text: `Hello ${user.name}, your abstract has been ${abstractStatus} by the admin.`,
//     // });
//     if (abstractStatus === "rejected") {
//       status.finalPaperStatus = "pending";
//       status.paperApprovedBy = null;
//       status.paymentStatus = "pending";
//       status.paymentApprovedBy = null;
//       await User.findByIdAndUpdate(id, { finalPaperStatus: "pending", paymentStatus: "unpaid" });
//       await Registration.findOneAndUpdate({ userId: id }, { finalPaperStatus: "pending", paymentStatus: "unpaid" });
//     }
//   }

//   // Final Paper workflow
//   if (finalPaperStatus) {
//     if (status.abstractStatus !== "approved") return res.status(400).json({ message: "Final paper cannot be updated before abstract approval" });
//     status.finalPaperStatus = finalPaperStatus;
//     status.paperApprovedBy = req.user._id;
//     await User.findByIdAndUpdate(id, { finalPaperStatus });
//     await Registration.findOneAndUpdate({ userId: id }, { finalPaperStatus });
// // Send email
//     // await sendEmail({
//     //   to: user.email,
//     //   subject: `Final Paper ${finalPaperStatus}`,
//     //   text: `Hello ${user.name}, your final paper has been ${finalPaperStatus} by the admin.`,
//     // });
//     if (finalPaperStatus === "rejected") {
//       status.paymentStatus = "pending";
//       status.paymentApprovedBy = null;
//       await User.findByIdAndUpdate(id, { paymentStatus: "unpaid" });
//       await Registration.findOneAndUpdate({ userId: id }, { paymentStatus: "unpaid" });
//     }
//   }

//   // Payment workflow
//   if (paymentStatus) {
//     if (status.finalPaperStatus !== "approved") return res.status(400).json({ message: "Payment cannot be updated before final paper approval" });
//     status.paymentStatus = paymentStatus;
//     status.paymentApprovedBy = req.user._id;
//     await User.findByIdAndUpdate(id, { paymentStatus });
//     await Registration.findOneAndUpdate({ userId: id }, { paymentStatus });
//   }
//  // Send email
//     // await sendEmail({
//     //   to: user.email,
//     //   subject: `Payment ${paymentStatus}`,
//     //   text: `Hello ${user.name}, your payment status is ${paymentStatus}.`,
//     // });
  
//   const updatedStatus = await status.save();
//   res.json(updatedStatus);
// });

export const updateUserApproval = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { abstractStatus, finalPaperStatus, paymentStatus } = req.body;

  const status = await AbstractStatus.findOne({ userId: id }).populate("userId", "name email");
  if (!status) return res.status(404).json({ message: "Status record not found" });

  const user = status.userId; // ✅ this is your user object for email

  // --------------------------
  // Abstract workflow
  // --------------------------
  if (abstractStatus) {
    status.abstractStatus = abstractStatus;
    status.abstractApprovedBy = req.user._id;

    await User.findByIdAndUpdate(id, { abstractStatus });
    await Registration.findOneAndUpdate({ userId: id }, { abstractStatus });

    // Send email
    // if (user?.email) {
    //   await sendEmail({
    //     to: user.email,
    //     subject: `Abstract ${abstractStatus}`,
    //     text: `Hello ${user.name}, your abstract has been ${abstractStatus} by the admin.`,
    //     html: `<p>Hello <b>${user.name}</b>,</p><p>Your abstract has been <b>${abstractStatus}</b> by the admin.</p>`,
    //   });
    // }

// if(user?.email){
// await sendEmail({
//   to: user.email,
//   subject: `Abstract ${abstractStatus}`,
//   text: `Hello ${user.name}, your abstract has been ${abstractStatus}.`, // fallback
//   html: emailTemplate(
//       `  <tr>
//                       <td align="center">
//                         <img src="https://www.google.com/imgres?q=ksr&imgurl=https%3A%2F%2Flookaside.fbsbx.com%2Flookaside%2Fcrawler%2Fmedia%2F%3Fmedia_id%3D2082249322122203&imgrefurl=https%3A%2F%2Fwww.facebook.com%2Fksr.educational.institutions%2F&docid=2_0MNXF2wu9lUM&tbnid=MceewFaVy1QzxM&vet=12ahUKEwjf64OQvM2PAxXK2TgGHf1yKC8QM3oECCYQAA..i&w=1024&h=389&hcb=2&ved=2ahUKEwjf64OQvM2PAxXK2TgGHf1yKC8QM3oECCYQAA"
//                              alt="KSR College of Engineering Banner"
//                              style="width:100%; max-width:600px; height:auto; display:block; border-radius:8px 8px 0 0;" />
//                       </td>
//                     </tr>`,
//     `Abstract ${abstractStatus}`,
//     `Your abstract has been <b>${abstractStatus}</b> by the admin.`,
//     `  <p style="margin-top: 20px;">
//                           <b>User Name:</b> ${user.name}<br/>
//                           <b>User ID:</b> ${user.userId}<br/>
//                           <b>User Abstract:</b> ${abstractStatus}<br/>
//      </p>`
//   ),
// });
// }


if(user?.email){
await sendEmail({
  to: user.email,
  subject: `Abstract ${abstractStatus}`,
  text: `Hello ${user.name}, your abstract has been ${abstractStatus}.`, // fallback
  html: emailTemplate(
    `Abstract ${abstractStatus}`,
    `Your abstract has been <b>${abstractStatus}</b> by the admin.`,
    user.name,
    undefined,
    undefined,
    abstractStatus
  ),
});
} 


    if (abstractStatus === "rejected") {
      status.finalPaperStatus = "pending";
      status.paperApprovedBy = null;
      status.paymentStatus = "pending";
      status.paymentApprovedBy = null;

      await User.findByIdAndUpdate(id, { finalPaperStatus: "pending", paymentStatus: "unpaid" });
      await Registration.findOneAndUpdate({ userId: id }, { finalPaperStatus: "pending", paymentStatus: "unpaid" });
    }
  }

  // --------------------------
  // Final Paper workflow
  // --------------------------
  if (finalPaperStatus) {
    if (status.abstractStatus !== "approved")
      return res.status(400).json({ message: "Final paper cannot be updated before abstract approval" });

    status.finalPaperStatus = finalPaperStatus;
    status.paperApprovedBy = req.user._id;

    await User.findByIdAndUpdate(id, { finalPaperStatus });
    await Registration.findOneAndUpdate({ userId: id }, { finalPaperStatus });

    // Send email
    // if (user?.email) {
    //   await sendEmail({
    //     to: user.email,
    //     subject: `Final Paper ${finalPaperStatus}`,
    //     text: `Hello ${user.name}, your final paper has been ${finalPaperStatus} by the admin.`,
    //     html: `<p>Hello <b>${user.name}</b>,</p><p>Your final paper has been <b>${finalPaperStatus}</b> by the admin.</p>`,
    //   });
    // }


// if(user?.email){
//     await sendEmail({
//   to: user.email,
//   subject: `Final Paper ${finalPaperStatus}`,
//   text: `Hello ${user.name}, your final paper has been ${finalPaperStatus}.`, // fallback
//   html: emailTemplate(
//       `  <tr>
//                       <td align="center">
//                         <img src="https://www.google.com/imgres?q=ksr&imgurl=https%3A%2F%2Flookaside.fbsbx.com%2Flookaside%2Fcrawler%2Fmedia%2F%3Fmedia_id%3D2082249322122203&imgrefurl=https%3A%2F%2Fwww.facebook.com%2Fksr.educational.institutions%2F&docid=2_0MNXF2wu9lUM&tbnid=MceewFaVy1QzxM&vet=12ahUKEwjf64OQvM2PAxXK2TgGHf1yKC8QM3oECCYQAA..i&w=1024&h=389&hcb=2&ved=2ahUKEwjf64OQvM2PAxXK2TgGHf1yKC8QM3oECCYQAA"
//                              alt="KSR College of Engineering Banner"
//                              style="width:100%; max-width:600px; height:auto; display:block; border-radius:8px 8px 0 0;" />
//                       </td>
//                     </tr>`,
//     `Final Paper ${finalPaperStatus}`,
//     `Your Final Paper has been <b>${finalPaperStatus}</b> by the admin.`,
//     `   <p style="margin-top: 20px;">
//                           <b>User Name:</b> ${userName}<br/>
//                           <b>User ID:</b> ${user.userId}<br/>
//                           <b>Final Paper Status:</b> ${finalPaperStatus}<br/>
//                         </p>`
//   ),
// });
// }

if(user?.email){
    await sendEmail({
  to: user.email,
  subject: `Final Paper ${finalPaperStatus}`,
  text: `Hello ${user.name}, your final paper has been ${finalPaperStatus}.`, // fallback
  html: emailTemplate(
    `Final Paper ${finalPaperStatus}`,
    `Your Final Paper has been <b>${finalPaperStatus}</b> by the admin.`,
    user.name,
    undefined,
    undefined,
    undefined,
    finalPaperStatus
  ),
});
}


    if (finalPaperStatus === "rejected") {
      status.paymentStatus = "pending";
      status.paymentApprovedBy = null;
      await User.findByIdAndUpdate(id, { paymentStatus: "unpaid" });
      await Registration.findOneAndUpdate({ userId: id }, { paymentStatus: "unpaid" });
    }
  }

  // --------------------------
  // Payment workflow
  // --------------------------
  if (paymentStatus) {
    if (status.finalPaperStatus !== "approved")
      return res.status(400).json({ message: "Payment cannot be updated before final paper approval" });

    status.paymentStatus = paymentStatus;
    status.paymentApprovedBy = req.user._id;

    await User.findByIdAndUpdate(id, { paymentStatus });
    await Registration.findOneAndUpdate({ userId: id }, { paymentStatus });

    // Send email
    // if (user?.email) {
    //   await sendEmail({
    //     to: user.email,
    //     subject: `Payment ${paymentStatus}`,
    //     text: `Hello ${user.name}, your payment status is ${paymentStatus}.`,
    //     html: `<p>Hello <b>${user.name}</b>,</p><p>Your payment status is <b>${paymentStatus}</b>.</p>`,
    //   });
    // }
// if(user?.email){
//     await sendEmail({
//   to: user.email,
//   subject: `Payment ${paymentStatus}`,
//   text: `Hello ${user.name}, your payment status is ${paymentStatus}.`, // fallback
//   html: emailTemplate(
//       `  <tr>
//                       <td align="center">
//                         <img src="https://www.google.com/imgres?q=ksr&imgurl=https%3A%2F%2Flookaside.fbsbx.com%2Flookaside%2Fcrawler%2Fmedia%2F%3Fmedia_id%3D2082249322122203&imgrefurl=https%3A%2F%2Fwww.facebook.com%2Fksr.educational.institutions%2F&docid=2_0MNXF2wu9lUM&tbnid=MceewFaVy1QzxM&vet=12ahUKEwjf64OQvM2PAxXK2TgGHf1yKC8QM3oECCYQAA..i&w=1024&h=389&hcb=2&ved=2ahUKEwjf64OQvM2PAxXK2TgGHf1yKC8QM3oECCYQAA"
//                              alt="KSR College of Engineering Banner"
//                              style="width:100%; max-width:600px; height:auto; display:block; border-radius:8px 8px 0 0;" />
//                       </td>
//                     </tr>`,
//     `Payment ${paymentStatus}`,
//     `Your payment status is <b>${paymentStatus}</b>.`,
//           ` <p style="margin-top: 20px;">
//                           <b>User Name:</b> ${userName}<br/>
//                              <b>User ID:</b> ${user.userId}<br/>
//                           <b>Payment Status:</b> ${paymentStatus}<br/>
//                         </p>`
//   ),
// });
// }

if(user?.email){
    await sendEmail({
  to: user.email,
  subject: `Payment ${paymentStatus}`,
  text: `Hello ${user.name}, your payment status is ${paymentStatus}.`, // fallback
  html: emailTemplate(
    `Payment ${paymentStatus}`,
    `Your payment status is <b>${paymentStatus}</b>.`,
    user.name,
    undefined,
    undefined,
    undefined,
    undefined,
    paymentStatus
  ),
});
}

  }

  const updatedStatus = await status.save();
  res.json(updatedStatus);
});
