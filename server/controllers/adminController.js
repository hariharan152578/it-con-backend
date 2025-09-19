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

//         // 🔹 Registration Details
//     registration: registration
//       ? {
//           _id: registration._id,
//           uniqueId: registration.uniqueId,
//           participants: registration.participants,
//           country: registration.country,
//           track: registration.track,
//           presentationMode: registration.presentationMode,
//           abstractTitle: registration.abstractTitle,
//           abstractContent:registration.abstractContent,
//           proofUrl: registration.proofUrl,
//           paperUrl: registration.paperUrl,
//         }
//       : null,

//     // 🔹 Workflow Status (Abstract / Paper / Payment)
//     workflow: abstractStatus
//       ? {
//           abstractStatus: abstractStatus.abstractStatus,
//           abstractApprovedBy: abstractStatus.abstractApprovedBy,

//           rejectedReason: abstractStatus.rejectedReason,
//           abstractreasonBy: abstractStatus.abstractreasonBy,

//           paperStatus: abstractStatus.paperStatus,
//           paperApprovedBy: abstractStatus.paperApprovedBy,

//           discount:abstractStatus.discount,

//           paymentStatus: abstractStatus.paymentStatus,
//           paymentApprovedBy: abstractStatus.paymentApprovedBy,
//           paymentMethod:abstractStatus.paymentMethod,
//           amountPaid:abstractStatus.amountPaid,
//           paymentDate:abstractStatus.paymentDate,
//           transactionId:abstractStatus.transactionId,

//           createdAt: abstractStatus.createdAt,
//           updatedAt: abstractStatus.updatedAt,
//         }
//       : {
//           abstractStatus: "No abstract",
//           paperStatus: "No paper",
//           paymentStatus: "unpaid",
//         },
//       };
//     })
//   );

//   res.json(userData);
// });

// // Get user by ID
// export const getUserById = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id).select("-password");
//   if (!user) return res.status(404).json({ message: "User not found" });

//   // ✅ Fetch registration & workflow
//   const registration = await Registration.findOne({ userId: user._id });
//   const abstractStatus = await AbstractStatus.findOne({ userId: user._id });

//   res.json({
//     // 🔹 Basic User Info
//     user: {
//       _id: user._id,
//       userId: user.userId,
//       name: user.name,
//       email: user.email,
//       mobileno: user.mobileno,
//       role: user.role,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt,
//     },

//     // 🔹 Registration Details
//     registration: registration
//       ? {
//           _id: registration._id,
//           uniqueId: registration.uniqueId,
//           participants: registration.participants,
//           address: registration.address,
//           country: registration.country,
//           track: registration.track,
//           presentationMode: registration.presentationMode,
//           abstractTitle: registration.abstractTitle,
//           abstractContent: registration.abstractContent,
//           abstractExpression: registration.abstractExpression,
//           proofUrl: registration.proofUrl,
//           paperUrl: registration.paperUrl,
//           createdAt: registration.createdAt,
//           updatedAt: registration.updatedAt,
//         }
//       : null,

//     // 🔹 Workflow Status (Abstract / Paper / Payment)
//     workflow: abstractStatus
//       ? {
//           abstractStatus: abstractStatus.abstractStatus,
//           abstractApprovedBy: abstractStatus.abstractApprovedBy,

//           rejectedReason: abstractStatus.rejectedReason,
//           abstractreasonBy: abstractStatus.abstractreasonBy,

//           paperStatus: abstractStatus.paperStatus,
//           paperApprovedBy: abstractStatus.paperApprovedBy,

//           discount:abstractStatus.discount,

//           paymentStatus: abstractStatus.paymentStatus,
//           paymentApprovedBy: abstractStatus.paymentApprovedBy,
//           paymentMethod:abstractStatus.paymentMethod,
//           currency:abstractStatus.currency,
//           amountPaid:abstractStatus.amountPaid,
//           paymentDate:abstractStatus.paymentDate,
//           transactionId:abstractStatus.transactionId,

//           createdAt: abstractStatus.createdAt,
//           updatedAt: abstractStatus.updatedAt,
//         }
//       : {
//           abstractStatus: "No abstract",
//           paperStatus: "No paper",
//           paymentStatus: "unpaid",
//         },
//   });
// });


// // ----------------------------
// // Update User Approval Workflow
// // ----------------------------



// export const updateUserApproval = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { abstractStatus, paperStatus, paymentStatus, content, discount } = req.body;

//   const status = await AbstractStatus.findOne({ userId: id }).populate("userId", "name email");
//   if (!status) return res.status(404).json({ message: "Status record not found" });

//   const user = status.userId; // ✅ full user object for email

//   // --------------------------
//   // Abstract workflow
//   // --------------------------
//   if (abstractStatus) {
//     status.abstractStatus = abstractStatus;
//     status.abstractApprovedBy = req.user._id;

//     await User.findByIdAndUpdate(id, { abstractStatus });

//     if (abstractStatus.toLowerCase() === "rejected") {
//       status.rejectedReason = content || "No reason provided";
//       status.abstractreasonBy = req.user._id;

//       // Reset dependent statuses
//       status.discount = false;
//       status.paperStatus = "No Data";
//       status.paperApprovedBy = null;
//       status.paymentStatus = "unpaid";
//       status.paymentApprovedBy = null;

//       await User.findByIdAndUpdate(id, {
//         PaperStatus: "No Data",
//         paymentStatus: "unpaid",
//       });
//     }

//     if (abstractStatus.toLowerCase() === "approved") {
//       status.rejectedReason = null;
//       status.discount = discount ?? false;
//     }

//     // ✉️ Email notification
//     if (user?.email) {
//       let subject, message;

//       if (abstractStatus.toLowerCase() === "rejected") {
//         subject = `Abstract ${abstractStatus} ❌`;
//         message = `
//           We regret to inform you that your abstract has been <b>${abstractStatus}</b>.<br/><br/>
//           <i>Reason: ${status.rejectedReason}</i><br/><br/>
//           Please review the guidelines and resubmit your abstract if possible.
//         `;
//       } else if (abstractStatus.toLowerCase() === "approved") {
//         subject = `Abstract ${abstractStatus} ✅`;
//         message = `
//           Congratulations! Your abstract has been <b>${abstractStatus}</b>.<br/><br/>
//           You may now proceed to the final paper submission.
//         `;
//       } else {
//         subject = `Abstract ${abstractStatus}`;
//         message = `Your abstract status has been updated to <b>${abstractStatus}</b>.`;
//       }

//       await sendEmail({
//         to: user.email,
//         subject,
//         text: `Hello ${user.name}, ${message.replace(/<[^>]+>/g, "")}`,
//         html: emailTemplate(
//           subject,
//           message,
//           user.name,
//           user.email,
//           user.userId,
//           abstractStatus,
//           undefined,
//           undefined,
//           status.rejectedReason
//         ),
//       });
//     }

//     await status.save();
//   }

//   // --------------------------
//   // TODO: Add back Paper workflow + Payment workflow (currently commented out)
//   // --------------------------

//   res.json(status);
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

  // Use Promise.all to fetch related data for each user
  const userData = await Promise.all(
    users.map(async (user) => {
      const registration = await Registration.findOne({ userId: user._id });
      const abstractStatus = await AbstractStatus.findOne({ userId: user._id });

      return {
        // 🔹 User basic details
        _id: user._id,
        userId: user.userId,
        name: user.name,

        // 🔹 Registration Details
    registration: registration
      ? {
          _id: registration._id,
          uniqueId: registration.uniqueId,
          participants: registration.participants,
          country: registration.country,
          track: registration.track,
          presentationMode: registration.presentationMode,
          abstractTitle: registration.abstractTitle,
          abstractContent:registration.abstractContent,
          proofUrl: registration.proofUrl,
          paperUrl: registration.paperUrl,
        }
      : null,

    // 🔹 Workflow Status (Abstract / Paper / Payment)
    workflow: abstractStatus
      ? {
          abstractStatus: abstractStatus.abstractStatus,
          abstractApprovedBy: abstractStatus.abstractApprovedBy,

          rejectedReason: abstractStatus.rejectedReason,
          abstractreasonBy: abstractStatus.abstractreasonBy,

          paperStatus: abstractStatus.paperStatus,
          paperApprovedBy: abstractStatus.paperApprovedBy,

          discount:abstractStatus.discount,

          paymentStatus: abstractStatus.paymentStatus,
          paymentApprovedBy: abstractStatus.paymentApprovedBy,
          paymentMethod:abstractStatus.paymentMethod,
          amountPaid:abstractStatus.amountPaid,
          paymentDate:abstractStatus.paymentDate,
          transactionId:abstractStatus.transactionId,

          createdAt: abstractStatus.createdAt,
          updatedAt: abstractStatus.updatedAt,
        }
      : {
          abstractStatus: "No abstract",
          paperStatus: "No paper",
          paymentStatus: "unpaid",
        },
      };
    })
  );

  res.json(userData);
});

// Get user by ID
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  // ✅ Fetch registration & workflow
  const registration = await Registration.findOne({ userId: user._id });
  const abstractStatus = await AbstractStatus.findOne({ userId: user._id });

  res.json({
    // 🔹 Basic User Info
    user: {
      _id: user._id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      mobileno: user.mobileno,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },

    // 🔹 Registration Details
    registration: registration
      ? {
          _id: registration._id,
          uniqueId: registration.uniqueId,
          participants: registration.participants,
          address: registration.address,
          country: registration.country,
          track: registration.track,
          presentationMode: registration.presentationMode,
          abstractTitle: registration.abstractTitle,
          abstractContent: registration.abstractContent,
          abstractExpression: registration.abstractExpression,
          proofUrl: registration.proofUrl,
          paperUrl: registration.paperUrl,
          createdAt: registration.createdAt,
          updatedAt: registration.updatedAt,
        }
      : null,

    // 🔹 Workflow Status (Abstract / Paper / Payment)
    workflow: abstractStatus
      ? {
          abstractStatus: abstractStatus.abstractStatus,
          abstractApprovedBy: abstractStatus.abstractApprovedBy,

          rejectedReason: abstractStatus.rejectedReason,
          abstractreasonBy: abstractStatus.abstractreasonBy,

          paperStatus: abstractStatus.paperStatus,
          paperApprovedBy: abstractStatus.paperApprovedBy,

          discount:abstractStatus.discount,

          paymentStatus: abstractStatus.paymentStatus,
          paymentApprovedBy: abstractStatus.paymentApprovedBy,
          paymentMethod:abstractStatus.paymentMethod,
          currency:abstractStatus.currency,
          amountPaid:abstractStatus.amountPaid,
          paymentDate:abstractStatus.paymentDate,
          transactionId:abstractStatus.transactionId,

          createdAt: abstractStatus.createdAt,
          updatedAt: abstractStatus.updatedAt,
        }
      : {
          abstractStatus: "No abstract",
          paperStatus: "No paper",
          paymentStatus: "unpaid",
        },
  });
});


// ----------------------------
// Update User Approval Workflow
// ----------------------------


// export const updateUserApproval = asyncHandler(async (req, res) => {
//   const { id } = req.params; // <-- custom userId (e.g., IC4576)
//   const { abstractStatus, finalPaperStatus, paymentStatus, content } = req.body;

//   // ✅ Find user by custom userId
//   const user = await User.findOne({ userId: id });
//   if (!user) return res.status(404).json({ message: "User not found" });

//   // ✅ Find abstract status by actual _id
//   const status = await AbstractStatus.findOne({ userId: user._id }).populate(
//     "userId",
//     "name email"
//   );
//   if (!status) return res.status(404).json({ message: "Status record not found" });

//   // --------------------------
//   // Abstract workflow
//   // --------------------------
//   if (abstractStatus) {
//     status.abstractStatus = abstractStatus;
//     status.abstractApprovedBy = req.user._id;

//     await User.findByIdAndUpdate(user._id, { abstractStatus });
//     await Registration.findOneAndUpdate({ userId: user._id }, { abstractStatus });

//     if (user?.email) {
//       let subject, message;
//       if (abstractStatus.toLowerCase() === "rejected") {
//         status.reason = content;
//         status.abstractreasonBy = req.user._id;
//         subject = `Abstract ${abstractStatus} ❌`;
//         message = `We regret to inform you that your abstract has been <b>${abstractStatus}</b> by the admin.`;
//       } else if (abstractStatus.toLowerCase() === "approved") {
//         status.reason = null;
//         subject = `Abstract ${abstractStatus} ✅`;
//         message = `Congratulations! Your abstract has been <b>${abstractStatus}</b> by the admin.`;
//       } else {
//         subject = `Abstract ${abstractStatus}`;
//         message = `Your abstract status has been updated to <b>${abstractStatus}</b>.`;
//       }

//       await sendEmail({
//         to: user.email,
//         subject,
//         text: `Hello ${user.name}, ${message.replace(/<[^>]+>/g, "")}`,
//         html: emailTemplate(subject, message, user.name, user.email, user.userId, abstractStatus, undefined, undefined, content),
//       });
//     }

//     if (abstractStatus.toLowerCase() === "rejected") {
//       status.finalPaperStatus = "pending";
//       status.paperApprovedBy = null;
//       status.paymentStatus = "pending";
//       status.paymentApprovedBy = null;

//       await User.findByIdAndUpdate(user._id, { finalPaperStatus: "pending", paymentStatus: "unpaid" });
//       await Registration.findOneAndUpdate({ userId: user._id }, { finalPaperStatus: "pending", paymentStatus: "unpaid" });
//     }
//   }

//   // --------------------------
//   // Final Paper workflow
//   // --------------------------
//   if (finalPaperStatus) {
//     if (status.abstractStatus !== "approved") {
//       return res.status(400).json({ message: "Final paper cannot be updated before abstract approval" });
//     }

//     status.finalPaperStatus = finalPaperStatus;
//     status.paperApprovedBy = req.user._id;

//     await User.findByIdAndUpdate(user._id, { finalPaperStatus });
//     await Registration.findOneAndUpdate({ userId: user._id }, { finalPaperStatus });

//     if (user?.email) {
//       await sendEmail({
//         to: user.email,
//         subject: `Final Paper ${finalPaperStatus}`,
//         text: `Hello ${user.name}, your final paper has been ${finalPaperStatus}.`,
//         html: emailTemplate(`Final Paper ${finalPaperStatus}`, `Your Final Paper has been <b>${finalPaperStatus}</b> by the admin.`, user.name),
//       });
//     }

//     if (finalPaperStatus === "rejected") {
//       status.paymentStatus = "pending";
//       status.paymentApprovedBy = null;
//       await User.findByIdAndUpdate(user._id, { paymentStatus: "unpaid" });
//       await Registration.findOneAndUpdate({ userId: user._id }, { paymentStatus: "unpaid" });
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

//     await User.findByIdAndUpdate(user._id, { paymentStatus });
//     await Registration.findOneAndUpdate({ userId: user._id }, { paymentStatus });

//     if (user?.email) {
//       await sendEmail({
//         to: user.email,
//         subject: `Payment ${paymentStatus}`,
//         text: `Hello ${user.name}, your payment status is ${paymentStatus}.`,
//         html: emailTemplate(`Payment ${paymentStatus}`, `Your payment status has been updated to <b>${paymentStatus}</b> by the admin.`, user.name),
//       });
//     }
//   }

//   const updatedStatus = await status.save();
//   res.json(updatedStatus);
// });

// --------------------------
// Update Abstract Status API
// --------------------------
export const updateUserApproval = asyncHandler(async (req, res) => {
  const { id } = req.params; // custom userId (e.g., IC4576)
  const { abstractStatus, content, discount } = req.body;

  // ✅ Find user by custom userId
  const user = await User.findOne({ userId: id });
  if (!user) return res.status(404).json({ message: "User not found" });

  // ✅ Find abstract status document
  const status = await AbstractStatus.findOne({ userId: user._id }).populate(
    "userId",
    "name email"
  );
  if (!status) return res.status(404).json({ message: "Status record not found" });

  // --------------------------
  // Abstract workflow
  // --------------------------
  if (abstractStatus) {
    // Update abstract status
    await AbstractStatus.updateOne(
      { _id: status._id },
      { $set: { abstractStatus, abstractApprovedBy: req.user._id } }
    );

    // Update User and Registration collection
    await User.findByIdAndUpdate(user._id, { abstractStatus });
    await Registration.findOneAndUpdate({ userId: user._id }, { abstractStatus });

    // Handle rejection
    if (abstractStatus.toLowerCase() === "rejected") {
      await AbstractStatus.updateOne(
        { _id: status._id },
        { $set: { rejectedReason: content || "No reason provided", abstractreasonBy: req.user._id } }
      );

      // Reset dependent fields safely without touching enums
      await User.findByIdAndUpdate(user._id, {
        finalPaperStatus: "pending",
        paymentStatus: "unpaid",
      });
      await Registration.findOneAndUpdate({ userId: user._id }, {
        finalPaperStatus: "pending",
        paymentStatus: "unpaid",
      });
    }

    // Handle approval
    if (abstractStatus.toLowerCase() === "approved") {
      await AbstractStatus.updateOne(
        { _id: status._id },
        { $set: { rejectedReason: null, discount: discount ?? false } }
      );
    }

    // --------------------------
    // Send email notification
    // --------------------------
    if (user?.email) {
      let subject, message;

      if (abstractStatus.toLowerCase() === "rejected") {
        subject = `Abstract ${abstractStatus} ❌`;
        message = `
          We regret to inform you that your abstract has been <b>${abstractStatus}</b>.<br/><br/>
          <i>Reason: ${content || "No reason provided"}</i><br/><br/>
          Please review the guidelines and resubmit if possible.
        `;
      } else if (abstractStatus.toLowerCase() === "approved") {
        subject = `Abstract ${abstractStatus} ✅`;
        message = `
          Congratulations! Your abstract has been <b>${abstractStatus}</b>.<br/><br/>
          You may now proceed to the final paper submission.
        `;
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
  }

  // ✅ Return the updated abstract status document
  const updatedStatus = await AbstractStatus.findById(status._id).populate("userId", "name email");
  res.json(updatedStatus);
});