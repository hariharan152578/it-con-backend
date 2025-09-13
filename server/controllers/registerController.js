// import asyncHandler from "express-async-handler";
// import cloudinary from "../config/cloudinary.js";
// import Registration from "../models/registerModel.js";
// import AbstractStatus from "../models/abstractStatusModel.js";
// import User from "../models/userModel.js";

// const bufferToDataUri = (file) => {
//   const base64 = file.buffer.toString("base64");
//   return `data:${file.mimetype};base64,${base64}`;
// };

// // ----------------------------
// // Submit Registration + Abstract
// // ----------------------------
// export const submitRegistration = asyncHandler(async (req, res) => {
//   const userId = req.user?.id;
//   if (!userId) return res.status(401).json({ message: "Not authorized" });

//   const user = await User.findById(userId);
//   if (!user) return res.status(404).json({ message: "User not found" });

//   const {
//     participants,
//     address,
//     country,
//     pincode,
//     track,
//     abstractTitle,
//     abstractContent,
//     abstractExpression,
//   } = req.body;

//   const registration = await Registration.findOneAndUpdate(
//     { userId },
//     {
//       uniqueId: user.userId,
//       participants,
//       address,
//       country,
//       pincode,
//       track,
//       abstractTitle,
//       abstractContent,
//       abstractExpression,
//     },
//     { new: true, upsert: true, runValidators: true }
//   );

//   await AbstractStatus.findOneAndUpdate(
//     { userId },
//     { abstractSubmitted: true, abstractStatus: "pending" }, // waiting for admin
//     { new: true, upsert: true }
//   );

//   res.status(201).json({
//     message: "Registration & abstract submitted. Await admin approval.",
//     registration,
//   });
// });

// // ----------------------------
// // Upload Final Paper
// // ----------------------------
// export const uploadFinalPaper = asyncHandler(async (req, res) => {
//   if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//   const userId = req.user.id;
//   const registration = await Registration.findOne({ userId });
//   if (!registration) return res.status(404).json({ message: "Registration not found" });

//   const status = await AbstractStatus.findOne({ userId });
//   if (!status || status.abstractStatus !== "approved") {
//     return res.status(403).json({
//       message: "Abstract not approved yet. Admin approval required before uploading final paper.",
//     });
//   }

//   // Upload file
//   const result = await cloudinary.uploader.upload(bufferToDataUri(req.file), {
//     resource_type: "auto",
//     folder: "conference/papers",
//     public_id: `paper_${userId}`,
//   });

//   // Save into Registration
//   registration.paperUrl = result.secure_url;
//   registration.finalPaperTitle = req.body.finalPaperTitle || registration.abstractTitle;
//   registration.finalPaperContent = req.body.finalPaperContent || "";
//   registration.finalPaperTrack = req.body.finalPaperTrack || registration.track;
//   await registration.save();

//   // Update workflow status
//   status.finalPaperStatus = "pending"; // waiting for admin
//   await status.save();

//   res.json({
//     message: "Final paper uploaded. Await admin approval.",
//     registration,
//     workflow: {
//       abstractStatus: status.abstractStatus,
//       finalPaperStatus: status.finalPaperStatus,
//       paymentStatus: status.paymentStatus,
//     },
//   });
// });

// // ----------------------------
// // Process Payment
// // ----------------------------

// export const processPayment = asyncHandler(async (req, res) => {
//   const userId = req.user.id;
//   const { paymentMethod, transactionId, amountPaid, currency } = req.body;

//   // 1. Find registration
//   const registration = await Registration.findOne({ userId });
//   if (!registration) return res.status(404).json({ message: "Registration not found" });

//   // 2. Check workflow status
//   const status = await AbstractStatus.findOne({ userId });
//   if (!status || status.finalPaperStatus !== "approved") {
//     return res.status(403).json({
//       message: "Final paper not approved yet. Cannot process payment.",
//     });
//   }

//   // 3. Save payment details (transaction info)
//   registration.paymentStatus = "paid";   // ✅ matches Registration schema
//   registration.paymentMethod = paymentMethod;
//   registration.transactionId = transactionId;
//   registration.amountPaid = amountPaid;
//   registration.currency = currency || "INR";
//   registration.paymentDate = new Date();
//   await registration.save();

//   // 4. Update workflow status (admin will later approve/reject)
//   status.paymentStatus = "approved";     // ✅ matches AbstractStatus schema
//   status.paymentApprovedBy = req.user._id;
//   await status.save();

//   res.json({
//     message: "Payment recorded successfully",
//     registration,
//     workflow: {
//       abstractStatus: status.abstractStatus,
//       finalPaperStatus: status.finalPaperStatus,
//       paymentStatus: status.paymentStatus,
//     },
//   });
// });


import asyncHandler from "express-async-handler";
import Registration from "../models/registerModel.js";
import AbstractStatus from "../models/abstractStatusModel.js";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
import { connect } from "mongoose";

// Helper: Convert buffer to base64 data URI
const bufferToDataUri = (file) => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

// ----------------------------
// Submit Registration + Abstract
// ----------------------------
// export const submitRegistration = asyncHandler(async (req, res) => {
//   const userId = req.user?.id;
//   if (!userId) return res.status(401).json({ message: "Not authorized" });

//   const { participants, address, country, pincode, track, abstractTitle, abstractContent, abstractExpression } = req.body;

//   const user = await User.findById(userId);
//   if (!user) return res.status(404).json({ message: "User not found" });

//   const registration = await Registration.findOneAndUpdate(
//     { userId },
//     { uniqueId: user.userId, participants, address, country, pincode, track, abstractTitle, abstractContent, abstractExpression },
//     { new: true, upsert: true, runValidators: true }
//   );

//   await AbstractStatus.findOneAndUpdate(
//     { userId },
//     { abstractSubmitted: true, abstractStatus: "pending" },
//     { new: true, upsert: true }
//   );

//   res.status(201).json({ message: "Registration & abstract submitted. Await admin approval.", registration });
// });

// export const submitRegistration = asyncHandler(async (req, res) => {
//   const userId = req.user?.id;
//   if (!userId) return res.status(401).json({ message: "Not authorized" });

//   const { participants, address, country, pincode, track, abstractTitle, abstractContent, abstractExpression } = req.body;

//   const user = await User.findById(userId);
//   if (!user) return res.status(404).json({ message: "User not found" });

//   const registration = await Registration.findOneAndUpdate(
//     { userId },
//     { uniqueId: user.userId, participants, address, country, pincode, track, abstractTitle, abstractContent, abstractExpression },
//     { new: true, upsert: true, runValidators: true }
//   );

//   await AbstractStatus.findOneAndUpdate(
//     { userId },
//     { abstractSubmitted: true, abstractStatus: "pending" },
//     { new: true, upsert: true }
//   );

//   res.status(201).json({ message: "Registration & abstract submitted. Await admin approval.", registration });
// });

// export const submitRegistration = asyncHandler(async (req, res) => {
//   const userId = req.user?.id;
//   if (!userId) return res.status(401).json({ message: "Not authorized" });

//   const {
//     participants,
//     address,
//     country,
//     pincode,
//     track,
//     abstractTitle,
//     abstractContent,
//     abstractExpression,
//     presentationMode   
//   } = req.body;

//   const user = await User.findById(userId);
//   if (!user) return res.status(404).json({ message: "User not found" });

//   // Validate participants array
//   if (!participants || !Array.isArray(participants) || participants.length === 0) {
//     return res.status(400).json({ message: "Participants are required" });
//   }

//   for (let i = 0; i < participants.length; i++) {
//     const p = participants[i];
//     if (!p.name || !p.designation || !p.organisation || !p.email || !p.phone || !p.gender) {
//       return res.status(400).json({
//         message: `Participant ${i + 1} is missing required fields (name, designation, organisation, email, phone, gender)`
//       });
//     }
//     // Optional: validate gender value
//     if (!["Male", "Female", "Other"].includes(p.gender)) {
//       return res.status(400).json({ message: `Participant ${i + 1} has invalid gender value` });
//     }
//   }
//   if (!["Online", "Offline"].includes(presentationMode)) {
//     return res.status(400).json({ message: "Presentation mode must be 'Online' or 'Offline'" });
//   }
//   const registration = await Registration.findOneAndUpdate(
//     { userId },
//     {
//       uniqueId: user.userId,
//       participants,
//       address,
//       country,
//       pincode,
//       track,
//       abstractTitle,
//       abstractContent,
//       abstractExpression,
//       presentationMode
//     },
//     { new: true, upsert: true, runValidators: true }
//   );

//   await AbstractStatus.findOneAndUpdate(
//     { userId },
//     { abstractSubmitted: true, abstractStatus: "pending" },
//     { new: true, upsert: true }
//   );

//   res.status(201).json({
//     message: "Registration & abstract submitted. Await admin approval.",
//     registration
//   });
// });


// import asyncHandler from "express-async-handler";
// import User from "../models/userModel.js";
// import Registration from "../models/registerModel.js";
// import AbstractStatus from "../models/abstractStatusModel.js";

export const submitRegistration = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Not authorized" });

  const {
    participants,
    address,
    country,
    pincode,
    track,
    abstractTitle,
    abstractContent,
    abstractExpression,
    presentationMode   
  } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  // ✅ Validate participants
  if (!participants || !Array.isArray(participants) || participants.length === 0) {
    return res.status(400).json({ message: "Participants are required" });
  }

  for (let i = 0; i < participants.length; i++) {
    const p = participants[i];
    if (!p.name || !p.designation || !p.organisation || !p.email || !p.phone || !p.gender) {
      return res.status(400).json({
        message: `Participant ${i + 1} is missing required fields (name, designation, organisation, email, phone, gender)`
      });
    }
    if (!["Male", "Female", "Other"].includes(p.gender)) {
      return res.status(400).json({ message: `Participant ${i + 1} has invalid gender value` });
    }
  }

  // ✅ Validate presentation mode
  if (!["Online", "Offline"].includes(presentationMode)) {
    return res.status(400).json({ message: "Presentation mode must be 'Online' or 'Offline'" });
  }

  // ✅ Save or update registration (no payment fields touched)
  const registration = await Registration.findOneAndUpdate(
    { userId },
    {
      uniqueId: user.userId,
      participants,
      address,
      country,
      pincode,
      track,
      abstractTitle,
      abstractContent,
      abstractExpression,
      presentationMode
    },
    { new: true, upsert: true, runValidators: true }
  );

  // ✅ Update workflow status
  await AbstractStatus.findOneAndUpdate(
    { userId },
    { abstractSubmitted: true, abstractStatus: "pending" },
    { new: true, upsert: true }
  );

  res.status(201).json({
    message: "Registration & abstract submitted. Await admin approval.",
    registration
  });
});

// ----------------------------
// Upload Final Paper
// ----------------------------
export const uploadFinalPaper = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const userId = req.user.id;
  const registration = await Registration.findOne({ userId });
  const abstractStatus=await AbstractStatus.findOne({userId})
  if (!registration) return res.status(404).json({ message: "Registration not found" });

  const status = await AbstractStatus.findOne({ userId });
  if(status.reason!==null)
    return res.status(403).json({message:`Abstract rejected by Admin ${abstractStatus.reason}`})
  if (!status || status.abstractStatus !== "approved")
    return res.status(403).json({ message: "Abstract not approved yet. Admin approval required before uploading final paper." });

  const result = await cloudinary.uploader.upload(bufferToDataUri(req.file), { resource_type: "auto", folder: "conference/papers", public_id: `paper_${userId}` });

  registration.paperUrl = result.secure_url;
  registration.finalPaperTitle = req.body.finalPaperTitle || registration.abstractTitle;
  registration.finalPaperContent = req.body.finalPaperContent || "";
  registration.finalPaperTrack = req.body.finalPaperTrack || registration.track;
  await registration.save();

  status.finalPaperStatus = "pending";
  await status.save();

  res.json({ message: "Final paper uploaded. Await admin approval.", registration, workflow: { abstractStatus: status.abstractStatus, finalPaperStatus: status.finalPaperStatus, paymentStatus: status.paymentStatus } });
});

// ----------------------------
// Process Payment
// ----------------------------
export const processPayment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { paymentMethod, transactionId, amountPaid, currency } = req.body;

  const registration = await Registration.findOne({ userId });
  if (!registration) return res.status(404).json({ message: "Registration not found" });

  const status = await AbstractStatus.findOne({ userId });
  if (!status || status.finalPaperStatus !== "approved")
    return res.status(403).json({ message: "Final paper not approved yet. Cannot process payment." });

  registration.paymentStatus = "paid";
  registration.paymentMethod = paymentMethod;
  registration.transactionId = transactionId;
  registration.amountPaid = amountPaid;
  registration.currency = currency || "INR";
  registration.paymentDate = new Date();
  await registration.save();

  status.paymentStatus = "approved";
  status.paymentApprovedBy = req.user._id;
  await status.save();

  res.json({ message: "Payment recorded successfully", registration, workflow: { abstractStatus: status.abstractStatus, finalPaperStatus: status.finalPaperStatus, paymentStatus: status.paymentStatus } });
});
