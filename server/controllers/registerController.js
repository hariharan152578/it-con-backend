import asyncHandler from "express-async-handler";
import Registration from "../models/registerModel.js";
import AbstractStatus from "../models/abstractStatusModel.js";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

// Helper: Convert buffer to base64 data URI
const bufferToDataUri = (file) => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

// export const submitRegistration = asyncHandler(async (req, res) => {
//   const userId = req.user?.id;
  
//   if (!userId) return res.status(401).json({ message: "Not authorized" });

//   let {
//     participants,
//     address,
//     country,
//     track,
//     pincode,
//     abstractTitle,
//     abstractContent,
//     abstractExpression,
//     presentationMode
//   } = req.body;

//   const user = await User.findById(userId);
//   if (!user) return res.status(404).json({ message: "User not found" });

//   // ✅ Parse participants if sent as string
//   if (typeof participants === "string") {
//     try {
//       participants = JSON.parse(participants);
//     } catch {
//       return res.status(400).json({ message: "Invalid participants JSON" });
//     }
//   }

//   // ✅ Require file
//   if (!req.file) return res.status(400).json({ message: "File is required" });

//   // ✅ Upload file to Cloudinary
//   const proofUrl = await new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { resource_type: "auto", folder: "proofs" },
//       (error, result) => {
//         if (error) reject(new Error("Cloudinary upload failed"));
//         else resolve(result.secure_url);
//       }
//     );
//     stream.end(req.file.buffer);
//   });

//   // ✅ Save/Update registration
//   const registration = await Registration.findOneAndUpdate(
//     { userId },
//     {
//       uniqueId: user.userId,
//       participants,
//       address,
//       country,
//       track,
//       pincode,
//       abstractTitle,
//       abstractContent,
//       abstractExpression,
//       presentationMode,
//       proofUrl,
//     },
//     { new: true, upsert: true, runValidators: true }
//   );
// await User.findByIdAndUpdate(userId, { abstractStatus: "under review" }, { new: true });
//   // ✅ Update abstract workflow ONLY in AbstractStatus
//   await AbstractStatus.findOneAndUpdate(
//     { userId },
//     { abstractStatus: "Submitted",rejectedReason:null, },
//     { new: true, upsert: true }
//   );

//   res.status(201).json({
//     message: "Registration & abstract submitted. Await admin approval.",
//     registration
//   });
// });




// ----------------------------
// Upload Final Paper
// ----------------------------
// export const uploadFinalPaper = asyncHandler(async (req, res) => {
//   const userId = req.user.id;

//   const registration = await Registration.findOne({ userId });
//   if (!registration) {
//     return res.status(404).json({ message: "Registration not found" });
//   }

//   const status = await AbstractStatus.findOne({ userId });
//   if (!status) {
//     return res.status(404).json({ message: "Abstract workflow not found" });
//   }

//   // 🔹 Ensure abstract is approved before final paper upload
//   if (status.abstractStatus.toLowerCase() !== "approved") {
//     if (status.abstractStatus.toLowerCase() === "rejected") {
//       return res
//         .status(403)
//         .json({ message: `Abstract rejected by Admin. Reason: ${status.rejectedReason || "No reason provided"}` });
//     }
//     return res
//       .status(403)
//       .json({ message: "Abstract not approved yet. Admin approval required before uploading final paper." });
//   }

//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   // 🔹 Upload to Cloudinary
//   const result = await cloudinary.uploader.upload(bufferToDataUri(req.file), {
//     resource_type: "auto",
//     folder: "conference/papers",
//     public_id: `paper_${userId}`,
//   });

//   // 🔹 Save in Registration
//   registration.paperUrl = result.secure_url;
//   await registration.save();

//   // 🔹 Update workflow status
//   status.paperStatus = "submitted"; // or "pending" if you want admin to approve
//   await status.save();

//   res.json({
//     message: "Final paper uploaded. Await admin approval.",
//     registration,
//     workflow: {
//       abstractStatus: status.abstractStatus,
//       paperStatus: status.paperStatus, // ✅ match field name
//       paymentStatus: status.paymentStatus,
//     },
//   });
// });

export const submitRegistration = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Not authorized" });

  let {
    participants,
    address,
    country,
    track,
    pincode,
    abstractTitle,
    abstractContent,
    abstractExpression,
    presentationMode
  } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  // ✅ Parse participants JSON
  if (typeof participants === "string") {
    try {
      participants = JSON.parse(participants);
    } catch {
      return res.status(400).json({ message: "Invalid participants JSON" });
    }
  }

  // ✅ Validate participants count (1–4 only)
  if (!Array.isArray(participants) || participants.length < 1 || participants.length > 4) {
    return res.status(400).json({ message: "Participants must be between 1 and 4" });
  }

  // ✅ Upload proofs (if provided)
  let proofUrls = [];
  if (req.files && req.files.length > 0) {
    proofUrls = await Promise.all(
      req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { resource_type: "auto", folder: "proofs" },
              (error, result) => {
                if (error) reject(new Error("Cloudinary upload failed"));
                else resolve(result.secure_url);
              }
            );
            stream.end(file.buffer);
          })
      )
    );
  }

  // ✅ Attach proofs → participants (missing ones = null)
  participants = participants.map((p, idx) => ({
    ...p,
    proofUrl: proofUrls[idx] || null,  // if proof not uploaded → null
  }));

  // ✅ Save/Update registration
  const registration = await Registration.findOneAndUpdate(
    { userId },
    {
      uniqueId: user.userId,
      participants,
      address,
      country,
      track,
      pincode,
      abstractTitle,
      abstractContent,
      abstractExpression,
      presentationMode
    },
    { new: true, upsert: true, runValidators: true }
  );

if (registration) {
  // If registration exists, update abstract status
  await User.findByIdAndUpdate(
    userId,
    { abstractStatus: "under review" },
    { new: true }
  );

  await AbstractStatus.findOneAndUpdate(
    { userId },
    { abstractStatus: "Submitted", rejectedReason: null },
    { new: true, upsert: true }
  );
} else {
  // No registration -> make sure statuses are set to "No abstract" and "No paper"
  await AbstractStatus.findOneAndUpdate(
    { userId },
    { abstractStatus: "No abstract", paperStatus: "No paper" },
    { new: true, upsert: true }
  );
}


  res.status(201).json({
    message: "Registration & abstract submitted. Await admin approval.",
    registration
  });
});


export const uploadFinalPaper = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const registration = await Registration.findOne({ userId });
  if (!registration) return res.status(404).json({ message: "Registration not found" });

  const status = await AbstractStatus.findOne({ userId });
  if (!status) return res.status(404).json({ message: "Abstract workflow not found" });

  if (status.abstractStatus !== "Approved") {
    return res.status(403).json({
      message:
        status.abstractStatus === "Rejected"
          ? `Abstract rejected by Admin. Reason: ${status.rejectedReason || "No reason provided"}`
          : "Abstract not approved yet. Admin approval required.",
    });
  }

  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const result = await cloudinary.uploader.upload(bufferToDataUri(req.file), {
    resource_type: "auto",
    folder: "conference/papers",
    public_id: `paper_${userId}`,
  });

  registration.paperUrl = result.secure_url;
  await registration.save();

  status.paperStatus = "submitted";
  await status.save();

  // ✅ Amount calculation based on first participant designation
  const firstParticipant = registration.participants[0];
  let amount=0;
 if (
  status.discount === true &&
  firstParticipant.designation.toLowerCase() === "student"
) {
  // Discounted student price
  amount = parseFloat(process.env.DISCOUNTED_STUDENT_AMOUNT || 7000);
} else {
  // Normal pricing by designation
  switch (firstParticipant.designation.toLowerCase()) {
    case "student":
      amount = parseFloat(process.env.AMOUNT_STUDENT || 10000);
      break;
    case "researcher":
      amount = parseFloat(process.env.AMOUNT_RESEARCHER || 12000);
      break;
    case "faculty":
      amount = parseFloat(process.env.AMOUNT_FACULTY || 13000);
      break;
    case "industry":
      amount = parseFloat(process.env.AMOUNT_INDUSTRY || 15000);
      break;
    default:
      amount = parseFloat(process.env.AMOUNT_DEFAULT || 10000); // fallback
  }
}

  // ✅ Apply admin-approved discount
  if (status.discount) {
    amount =amount;
  }

  res.json({
    message: "Final paper uploaded successfully. Proceed to payment.",
    paperUrl: registration.paperUrl,
    amount,
    currency: process.env.CURRENCY || "INR",
    redirectUrl: `/api/payments/create-order?userId=${userId}&amount=${amount}&currency=${process.env.CURRENCY || "INR"}`,
  });
});



// ----------------------------
// Process Payment
// ----------------------------
// export const processPayment = asyncHandler(async (req, res) => {
//   const userId = req.user.id;
//   const { paymentMethod, transactionId, amountPaid, currency } = req.body;

//   const registration = await Registration.findOne({ userId });
//   if (!registration) return res.status(404).json({ message: "Registration not found" });

//   const status = await AbstractStatus.findOne({ userId });
//   if (!status || status.finalPaperStatus !== "approved")
//     return res.status(403).json({ message: "Final paper not approved yet. Cannot process payment." });

//   registration.paymentStatus = "paid";
//   registration.paymentMethod = paymentMethod;
//   registration.transactionId = transactionId;
//   registration.amountPaid = amountPaid;
//   registration.currency = currency || "INR";
//   registration.paymentDate = new Date();
//   await registration.save();

//   status.paymentStatus = "approved";
//   status.paymentApprovedBy = req.user._id;
//   await status.save();

//   res.json({ message: "Payment recorded successfully", registration, workflow: { abstractStatus: status.abstractStatus, finalPaperStatus: status.finalPaperStatus, paymentStatus: status.paymentStatus } });
// });

export const processPayment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { paymentMethod, transactionId } = req.body;

  const registration = await Registration.findOne({ userId });
  if (!registration) return res.status(404).json({ message: "Registration not found" });

  const status = await AbstractStatus.findOne({ userId });
  if (!status || status.paperStatus !== "submitted")
    return res.status(403).json({ message: "Final paper not submitted yet. Cannot process payment." });

  // ✅ Recalculate amount based on designation and discount
  const firstParticipant = registration.participants[0];
  let amount = 0;

  switch (firstParticipant.designation.toLowerCase()) {
    case "student":
      amount = parseFloat(process.env.AMOUNT_STUDENT || 1000);
      break;
    case "researcher":
      amount = parseFloat(process.env.AMOUNT_RESEARCHER || 2000);
      break;
    case "faculty":
      amount = parseFloat(process.env.AMOUNT_FACULTY || 3000);
      break;
    case "industry":
      amount = parseFloat(process.env.AMOUNT_INDUSTRY || 5000);
      break;
    default:
      amount = parseFloat(process.env.AMOUNT_STUDENT || 1000);
  }

  if (status.discount) {
    const discountPercent = parseFloat(process.env.DISCOUNT_PERCENTAGE || 30);
    amount = amount - (amount * discountPercent) / 100;
  }

  registration.paymentStatus = "paid";
  registration.paymentMethod = paymentMethod;
  registration.transactionId = transactionId;
  registration.amountPaid = amount;
  registration.currency = process.env.CURRENCY || "INR";
  registration.paymentDate = new Date();
  await registration.save();

  status.paymentStatus = "paid";
  status.paymentApprovedBy = req.user._id;
  await status.save();

  res.json({
    message: "Payment recorded successfully",
    registration,
    workflow: {
      abstractStatus: status.abstractStatus,
      paperStatus: status.paperStatus,
      paymentStatus: status.paymentStatus,
    },
  });
});
