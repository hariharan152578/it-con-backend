// import asyncHandler from "express-async-handler";
// import Admin from "../models/adminModel.js";
// import User from "../models/userModel.js";
// import AbstractStatus from "../models/abstractStatusModel.js";
// import Registration from "../models/registerModel.js";
// import { generateToken } from "../middleware/authMiddleware.js";
// import { sendEmail } from "../config/email.js";
// import { emailTemplate } from "../config/emailTemplate.js";
// // ----------------------------
// // Register Admin
// // ----------------------------
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

// // ----------------------------
// // Login Admin
// // ----------------------------
// export const loginAdmin = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   const admin = await Admin.findOne({ email });

//   if (admin && (await admin.matchPassword(password))) {
//     res.json({
//       _id: admin._id,
//       name: admin.name,
//       email: admin.email,
//       token: generateToken(admin._id),
//     });
//   } else {
//     res.status(401).json({ message: "Invalid email or password" });
//   }
// });

// // ----------------------------
// // Get all users
// // ----------------------------
// export const getAllUsers = asyncHandler(async (req, res) => {
//   const users = await User.find().select("-password");

//   // Use Promise.all to fetch related data for each user
//   const userData = await Promise.all(
//     users.map(async (user) => {
//       const registration = await Registration.findOne({ userId: user._id });
//       const abstractStatus = await AbstractStatus.findOne({ userId: user._id });

//       return {
//         // 🔹 User basic details
//         _id: user._id,
//         userId: user.userId,
//         name: user.name,
//         email: user.email,
//         mobileno: user.mobileno,

//         // 🔹 Registration details (null if not submitted yet)
//         abstractContent: registration ? registration.abstractContent : null,
//         abstractExpression: registration ? registration.abstractExpression : null,
//         abstractTitle: registration ? registration.abstractTitle : null,
//         address: registration ? registration.address : null,
//         country: registration ? registration.country : null,
//         currency: registration ? registration.currency : "INR",
//         participants: registration ? registration.participants : [],
//         pincode: registration ? registration.pincode : null,
//         track: registration ? registration.track : null,
//         presentationMode: registration ? registration.presentationMode : null,

//         // 🔹 Workflow status
//         abstractStatus: abstractStatus ? abstractStatus.abstractStatus : "pending",
//         finalPaperStatus: abstractStatus ? abstractStatus.finalPaperStatus : "pending",

//         // 🔹 Payment status
//         paymentStatus: registration ? registration.paymentStatus : "unpaid",
//         paymentDate: registration ? registration.paymentDate : null,
//         amountPaid: registration ? registration.amountPaid : 0,
//       };
//     })
//   );

//   res.json(userData);
// });

// // ----------------------------
// // Get user by ID
// // ----------------------------
// // export const getUserById = asyncHandler(async (req, res) => {
// //   const user = await User.findById(req.params.id).select("-password");
// //   if (!user) return res.status(404).json({ message: "User not found" });

// //   res.json(user);
// // });

// export const getUserById = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id).select("-password");
//   if (!user) return res.status(404).json({ message: "User not found" });

//   // ✅ Fetch registration details
//   const registration = await Registration.findOne({ userId: user._id });

//   // ✅ Fetch abstract/final paper workflow status
//   const abstractStatus = await AbstractStatus.findOne({ userId: user._id });

//   res.json({
//     // 🔹 User basic details
//     _id: user._id,
//     userId: user.userId,
//     name: user.name,
//     email: user.email,
//     mobileno: user.mobileno,

//     // 🔹 Registration details (null if not submitted yet)
//     abstractContent:registration.abstractContent,
//     abstractExpression:registration.abstractExpression,
//     abstractTitle:registration.abstractTitle,
//     address:registration.address,
//     country:registration.country,
//     currency:registration.currency,
//     participants:registration.participants,
//     pincode:registration.pincode,
//     track:registration.track,
//     presentationMode:registration.presentationMode,


//     // 🔹 Workflow status
//     abstractStatus: abstractStatus ? abstractStatus.abstractStatus : "pending",
//     finalPaperStatus: abstractStatus ? abstractStatus.finalPaperStatus : "pending",

//     // 🔹 Payment status (from registration, fallback if not present)
//     paymentStatus: registration ? registration.paymentStatus : "unpaid",
//     paymentDate: registration ? registration.paymentDate : null,
//     amountPaid: registration ? registration.amountPaid : 0,
//   });
// });

// // ----------------------------
// // Update User Approval Workflow
// // ----------------------------


// export const updateUserApproval = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { abstractStatus, finalPaperStatus, paymentStatus, content } = req.body;

//   const status = await AbstractStatus.findOne({ userId: id }).populate("userId", "name email");
//   if (!status) return res.status(404).json({ message: "Status record not found" });

//   const user = status.userId; // ✅ user object for email

//   // --------------------------
//   // Abstract workflow
//   // --------------------------
// if (abstractStatus) {
//   // Update abstract status in DB
//   status.abstractStatus = abstractStatus;
//   status.abstractApprovedBy = req.user._id;

//   await User.findByIdAndUpdate(id, { abstractStatus });
//   await Registration.findOneAndUpdate({ userId: id }, { abstractStatus });

//   if (user?.email) {
//     // Prepare email subject and message
//     let subject, message;
    
//     if (abstractStatus.toLowerCase() === "rejected") {
//       status.reason=content
//       status.abstractreasonBy=req.user._id
//       subject = `Abstract ${abstractStatus} ❌`;
//       message = `
//         We regret to inform you that your abstract has been <b>${abstractStatus}</b> by the admin.<br/><br/>
//         <i>Please review the guidelines and resubmit your abstract if possible.</i>
//       `;
//     } else if (abstractStatus.toLowerCase() === "approved") {
//       status.reason=null;
//       subject = `Abstract ${abstractStatus} ✅`;
//       message = `
//         Congratulations! Your abstract has been <b>${abstractStatus}</b> by the admin.<br/><br/>
//         You may now proceed to the final paper submission.
//       `;
//     } else {
//       subject = `Abstract ${abstractStatus}`;
//       message = `Your abstract status has been updated to <b>${abstractStatus}</b>.`;
//     }

//     // Send email
//     await sendEmail({
//       to: user.email,
//       subject,
//       text: `Hello ${user.name}, ${message.replace(/<[^>]+>/g, "")}`, // plain text fallback
//       html: emailTemplate(
//         subject,
//         message,
//         user.name,
//         user.email,
//         user.userId,
//         abstractStatus, // pass abstract status to template
//         undefined,
//         undefined,
//         content // pass content/reason for template
//       ),
//     });
//   }

//   // If abstract rejected, reset dependent statuses
//   if (abstractStatus.toLowerCase() === "rejected") {
//     status.finalPaperStatus = "pending";
//     status.paperApprovedBy = null;
//     status.paymentStatus = "pending";
//     status.paymentApprovedBy = null;

//     await User.findByIdAndUpdate(id, { finalPaperStatus: "pending", paymentStatus: "unpaid" });
//     await Registration.findOneAndUpdate(
//       { userId: id },
//       { finalPaperStatus: "pending", paymentStatus: "unpaid" }
//     );
//   }
// }

//   // --------------------------
//   // Final Paper workflow
//   // --------------------------
//   if (finalPaperStatus) {
//     if (status.abstractStatus !== "approved") {
//       return res.status(400).json({ message: "Final paper cannot be updated before abstract approval" });
//     }

//     status.finalPaperStatus = finalPaperStatus;
//     status.paperApprovedBy = req.user._id;

//     await User.findByIdAndUpdate(id, { finalPaperStatus });
//     await Registration.findOneAndUpdate({ userId: id }, { finalPaperStatus });

//     if (user?.email) {
//       await sendEmail({
//         to: user.email,
//         subject: `Final Paper ${finalPaperStatus}`,
//         text: `Hello ${user.name}, your final paper has been ${finalPaperStatus}.`,
//         html: emailTemplate(
//           `Final Paper ${finalPaperStatus}`,
//           `Your Final Paper has been <b>${finalPaperStatus}</b> by the admin.`,
//           user.name,
//           undefined,
//           undefined,
//           undefined,
//           finalPaperStatus
//         ),
//       });
//     }

//     if (finalPaperStatus === "rejected") {
//       status.paymentStatus = "pending";
//       status.paymentApprovedBy = null;
//       await User.findByIdAndUpdate(id, { paymentStatus: "unpaid" });
//       await Registration.findOneAndUpdate({ userId: id }, { paymentStatus: "unpaid" });
//     }
//   }

//   // --------------------------
//   // Payment workflow
//   // --------------------------
//   if (paymentStatus) {
//     if (status.finalPaperStatus !== "approved") {
//       return res.status(400).json({ message: "Payment cannot be updated before final paper approval" });
//     }

//     status.paymentStatus = paymentStatus;
//     status.paymentApprovedBy = req.user._id;

//     await User.findByIdAndUpdate(id, { paymentStatus });
//     await Registration.findOneAndUpdate({ userId: id }, { paymentStatus });

//     if (user?.email) {
//       await sendEmail({
//         to: user.email,
//         subject: `Payment ${paymentStatus}`,
//         text: `Hello ${user.name}, your payment status is ${paymentStatus}.`,
//         html: emailTemplate(
//           `Payment ${paymentStatus}`,
//           `Your payment status has been updated to <b>${paymentStatus}</b> by the admin.`,
//           user.name,
//           undefined,
//           undefined,
//           undefined,
//           undefined,
//           paymentStatus
//         ),
//       });
//     }
//   }

//   const updatedStatus = await status.save();
//   res.json(updatedStatus);
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

  const userData = await Promise.all(
    users.map(async (user) => {
      const registration = await Registration.findOne({ userId: user._id });
      const abstractStatus = await AbstractStatus.findOne({ userId: user._id });

      return {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        mobileno: user.mobileno,

        abstractContent: registration ? registration.abstractContent : null,
        abstractExpression: registration ? registration.abstractExpression : null,
        abstractTitle: registration ? registration.abstractTitle : null,
        address: registration ? registration.address : null,
        country: registration ? registration.country : null,
        currency: registration ? registration.currency : "INR",
        participants: registration ? registration.participants : [],
        pincode: registration ? registration.pincode : null,
        track: registration ? registration.track : null,
        presentationMode: registration ? registration.presentationMode : null,

        abstractStatus: abstractStatus ? abstractStatus.abstractStatus : "pending",
        finalPaperStatus: abstractStatus ? abstractStatus.finalPaperStatus : "pending",

        paymentStatus: registration ? registration.paymentStatus : "unpaid",
        paymentDate: registration ? registration.paymentDate : null,
        amountPaid: registration ? registration.amountPaid : 0,
      };
    })
  );

  res.json(userData);
});

// ----------------------------
// Get user by ID
// ----------------------------
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  const registration = await Registration.findOne({ userId: user._id });
  const abstractStatus = await AbstractStatus.findOne({ userId: user._id });

  res.json({
    _id: user._id,
    userId: user.userId,
    name: user.name,
    email: user.email,
    mobileno: user.mobileno,

    abstractContent: registration?.abstractContent,
    abstractExpression: registration?.abstractExpression,
    abstractTitle: registration?.abstractTitle,
    address: registration?.address,
    country: registration?.country,
    currency: registration?.currency,
    participants: registration?.participants,
    pincode: registration?.pincode,
    track: registration?.track,
    presentationMode: registration?.presentationMode,

    abstractStatus: abstractStatus ? abstractStatus.abstractStatus : "pending",
    finalPaperStatus: abstractStatus ? abstractStatus.finalPaperStatus : "pending",

    paymentStatus: registration ? registration.paymentStatus : "unpaid",
    paymentDate: registration ? registration.paymentDate : null,
    amountPaid: registration ? registration.amountPaid : 0,
  });
});

// ----------------------------
// Update User Approval Workflow
// ----------------------------
export const updateUserApproval = asyncHandler(async (req, res) => {
  const { id } = req.params; // <-- custom userId (e.g., IC4576)
  const { abstractStatus, finalPaperStatus, paymentStatus, content } = req.body;

  // ✅ Find user by custom userId
  const user = await User.findOne({ userId: id });
  if (!user) return res.status(404).json({ message: "User not found" });

  // ✅ Find abstract status by actual _id
  const status = await AbstractStatus.findOne({ userId: user._id }).populate(
    "userId",
    "name email"
  );
  if (!status) return res.status(404).json({ message: "Status record not found" });

  // --------------------------
  // Abstract workflow
  // --------------------------
  if (abstractStatus) {
    status.abstractStatus = abstractStatus;
    status.abstractApprovedBy = req.user._id;

    await User.findByIdAndUpdate(user._id, { abstractStatus });
    await Registration.findOneAndUpdate({ userId: user._id }, { abstractStatus });

    if (user?.email) {
      let subject, message;
      if (abstractStatus.toLowerCase() === "rejected") {
        status.reason = content;
        status.abstractreasonBy = req.user._id;
        subject = `Abstract ${abstractStatus} ❌`;
        message = `We regret to inform you that your abstract has been <b>${abstractStatus}</b> by the admin.`;
      } else if (abstractStatus.toLowerCase() === "approved") {
        status.reason = null;
        subject = `Abstract ${abstractStatus} ✅`;
        message = `Congratulations! Your abstract has been <b>${abstractStatus}</b> by the admin.`;
      } else {
        subject = `Abstract ${abstractStatus}`;
        message = `Your abstract status has been updated to <b>${abstractStatus}</b>.`;
      }

      await sendEmail({
        to: user.email,
        subject,
        text: `Hello ${user.name}, ${message.replace(/<[^>]+>/g, "")}`,
        html: emailTemplate(subject, message, user.name, user.email, user.userId, abstractStatus, undefined, undefined, content),
      });
    }

    if (abstractStatus.toLowerCase() === "rejected") {
      status.finalPaperStatus = "pending";
      status.paperApprovedBy = null;
      status.paymentStatus = "pending";
      status.paymentApprovedBy = null;

      await User.findByIdAndUpdate(user._id, { finalPaperStatus: "pending", paymentStatus: "unpaid" });
      await Registration.findOneAndUpdate({ userId: user._id }, { finalPaperStatus: "pending", paymentStatus: "unpaid" });
    }
  }

  // --------------------------
  // Final Paper workflow
  // --------------------------
  if (finalPaperStatus) {
    if (status.abstractStatus !== "approved") {
      return res.status(400).json({ message: "Final paper cannot be updated before abstract approval" });
    }

    status.finalPaperStatus = finalPaperStatus;
    status.paperApprovedBy = req.user._id;

    await User.findByIdAndUpdate(user._id, { finalPaperStatus });
    await Registration.findOneAndUpdate({ userId: user._id }, { finalPaperStatus });

    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: `Final Paper ${finalPaperStatus}`,
        text: `Hello ${user.name}, your final paper has been ${finalPaperStatus}.`,
        html: emailTemplate(`Final Paper ${finalPaperStatus}`, `Your Final Paper has been <b>${finalPaperStatus}</b> by the admin.`, user.name),
      });
    }

    if (finalPaperStatus === "rejected") {
      status.paymentStatus = "pending";
      status.paymentApprovedBy = null;
      await User.findByIdAndUpdate(user._id, { paymentStatus: "unpaid" });
      await Registration.findOneAndUpdate({ userId: user._id }, { paymentStatus: "unpaid" });
    }
  }

  // --------------------------
  // Payment workflow
  // --------------------------
  if (paymentStatus) {
    if (status.finalPaperStatus !== "approved") {
      return res.status(400).json({ message: "Payment cannot be updated before final paper approval" });
    }

    status.paymentStatus = paymentStatus;
    status.paymentApprovedBy = req.user._id;

    await User.findByIdAndUpdate(user._id, { paymentStatus });
    await Registration.findOneAndUpdate({ userId: user._id }, { paymentStatus });

    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: `Payment ${paymentStatus}`,
        text: `Hello ${user.name}, your payment status is ${paymentStatus}.`,
        html: emailTemplate(`Payment ${paymentStatus}`, `Your payment status has been updated to <b>${paymentStatus}</b> by the admin.`, user.name),
      });
    }
  }

  const updatedStatus = await status.save();
  res.json(updatedStatus);
});
