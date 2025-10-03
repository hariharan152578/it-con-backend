import asyncHandler from "express-async-handler";
import Registration from "../models/registerModel.js";
import AbstractStatus from "../models/abstractStatusModel.js";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
import crypto from "crypto";
import axios from "axios";
// Helper: convert buffer to Base64 for Cloudinary
const bufferToDataUri = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

// ----------------------------
// Submit Registration (unchanged, except workflow updates)
// ----------------------------
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

//   // Parse participants if JSON string
//   if (typeof participants === "string") {
//     try {
//       participants = JSON.parse(participants);
//     } catch {
//       return res.status(400).json({ message: "Invalid participants JSON" });
//     }
//   }

//   if (!Array.isArray(participants) || participants.length < 1 || participants.length > 4) {
//     return res.status(400).json({ message: "Participants must be between 1 and 4" });
//   }

//   // Upload proofs (optional)
//   let proofUrls = [];
//   if (req.files && req.files.length > 0) {
//     proofUrls = await Promise.all(
//       req.files.map(
//         (file) =>
//           new Promise((resolve, reject) => {
//             const stream = cloudinary.uploader.upload_stream(
//               { resource_type: "auto", folder: "proofs" },
//               (error, result) => {
//                 if (error) reject(new Error("Cloudinary upload failed"));
//                 else resolve(result.secure_url);
//               }
//             );
//             stream.end(file.buffer);
//           })
//       )
//     );
//   }

//   participants = participants.map((p, idx) => ({
//     ...p,
//     proofUrl: proofUrls[idx] || null,
//   }));

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
//     },
//     { new: true, upsert: true, runValidators: true }
//   );

//   // Workflow update
// if (registration) {
//   // If registration exists, update abstract status
//   await User.findByIdAndUpdate(
//     userId,
//     { abstractStatus: "under review" },
//     { new: true }
//   );

//   await AbstractStatus.findOneAndUpdate(
//     { userId },
//     { abstractStatus: "Submitted", rejectedReason: null },
//     { new: true, upsert: true }
//   );
// } else {
//   // No registration -> make sure statuses are set to "No abstract" and "No paper"
//   await AbstractStatus.findOneAndUpdate(
//     { userId },
//     { abstractStatus: "No abstract", paperStatus: "No paper" },
//     { new: true, upsert: true }
//   );
// }

//   res.status(201).json({
//     message: "Registration & abstract submitted. Await admin approval.",
//     registration,
//   });
// });


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
//     presentationMode,
//   } = req.body;

//   // Parse participants if sent as string
//   if (typeof participants === "string") {
//     try {
//       participants = JSON.parse(participants);
//     } catch {
//       return res.status(400).json({ message: "Invalid participants JSON" });
//     }
//   }

//   // Validate participants array
//   if (!Array.isArray(participants) || participants.length < 1 || participants.length > 4) {
//     return res.status(400).json({ message: "Participants must be between 1 and 4" });
//   }

//   // Upload proofs if any
//   let proofUrls = [];
//   if (req.files && req.files.length > 0) {
//     proofUrls = await Promise.all(
//       req.files.map(
//         (file) =>
//           new Promise((resolve, reject) => {
//             const stream = cloudinary.uploader.upload_stream(
//               { resource_type: "auto", folder: "proofs" },
//               (error, result) => {
//                 if (error) reject(new Error("Cloudinary upload failed"));
//                 else resolve(result.secure_url);
//               }
//             );
//             stream.end(file.buffer);
//           })
//       )
//     );
//   }

//   // Attach proofs to participants
//   participants = participants.map((p, idx) => ({
//     ...p,
//     proofUrl: proofUrls[idx] || null,
//   }));

//   // Save / update registration
//   const registration = await Registration.findOneAndUpdate(
//     { userId },
//     {
//       uniqueId: userId, // or generate your own unique ID
//       participants,
//       address,
//       country,
//       track,
//       pincode,
//       abstractTitle,
//       abstractContent,
//       abstractExpression,
//       presentationMode,
//     },
//     { new: true, upsert: true, runValidators: true }
//   );

// if (registration) {
//   // If registration exists, update abstract status
//   await User.findByIdAndUpdate(
//     userId,
//     { abstractStatus: "under review" },
//     { new: true }
//   );

//   await AbstractStatus.findOneAndUpdate(
//     { userId },
//     { abstractStatus: "Submitted", rejectedReason: null },
//     { new: true, upsert: true }
//   );
// } else {
//   // No registration -> make sure statuses are set to "No abstract" and "No paper"
//   await AbstractStatus.findOneAndUpdate(
//     { userId },
//     { abstractStatus: "No abstract", paperStatus: "No paper" },
//     { new: true, upsert: true }
//   );
// }

//   res.status(201).json({
//     message: "Registration & abstract submitted. Await admin approval.",
//     registration,
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
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              resolve(result.secure_url);
            }
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
      { paymentStatus: "Unpaid", paperStatus: "No paper" },
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
    await User.findOneAndUpdate(
      { userId },
      { paymentStatus: "Unpaid", paperStatus: "No paper" },
      { new: true, upsert: true }
    );
  }


  res.status(201).json({
    message: "Registration & abstract submitted. Await admin approval.",
    registration
  });
});


const { PHONEPE_MERCHANT_ID, PHONEPE_MERCHANT_SECRET, PHONEPE_BASE_URL } = process.env;
// ----------------------------
// Upload Final Paper & Calculate Amount
// ----------------------------


// ----------------------------
// Process Payment
// ----------------------------

// ----------------------------
// Create Payment Order
// ----------------------------
// export const createPhonePeOrder = asyncHandler(async (req, res) => {
//   const userId = req.user.id;

//   const registration = await Registration.findOne({ userId });
//   if (!registration) {
//     return res.status(404).json({ message: "Registration not found" });
//   }

//   const amount = registration.payment.amountPaid;
//   if (!amount) {
//     return res.status(400).json({ message: "Amount not set. Upload final paper first." });
//   }

//   const transactionId = `TXN_${userId}_${Date.now()}`;
//   const payload = {
//     merchantId: PHONEPE_MERCHANT_ID,
//     transactionId,
//     merchantUserId: userId,
//     amount: amount * 100, // in paise
//     redirectUrl: `https://yourdomain.com/payment/success`,
//     callbackUrl: `https://yourdomain.com/api/payments/phonepe/callback`,
//     paymentInstrument: {
//       type: "PAY_PAGE",
//     },
//   };

//   const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");
//   const saltKey = PHONEPE_MERCHANT_SECRET;
//   const checksum = crypto
//     .createHash("sha256")
//     .update(payloadBase64 + "/pg/v1/pay" + saltKey)
//     .digest("hex");

//   const headers = {
//     "Content-Type": "application/json",
//     "X-VERIFY": checksum + "###1",
//   };

//   try {
//     const response = await axios.post(`${PHONEPE_BASE_URL}/pg/v1/pay`, { request: payloadBase64 }, { headers });

//     if (response.data.success) {
//       res.json({
//         message: "PhonePe order created",
//         redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
//       });
//     } else {
//       res.status(400).json({ message: "PhonePe order creation failed", details: response.data });
//     }
//   } catch (err) {
//     res.status(500).json({ message: "PhonePe API error", error: err.message });
//   }
// });


// ----------------------------
// Payment Callback (from PhonePe)
// ----------------------------
// export const phonePeCallback = asyncHandler(async (req, res) => {
//   const { transactionId, code, amount } = req.body;

//   if (code !== "PAYMENT_SUCCESS") {
//     return res.status(400).json({ message: "Payment failed", details: req.body });
//   }

//   const registration = await Registration.findOne({ "payment.transactionId": transactionId });
//   if (!registration) {
//     return res.status(404).json({ message: "Registration not found for transaction" });
//   }

//   // Update payment
//   registration.payment.paymentStatus = "paid";
//   registration.payment.transactionId = transactionId;
//   registration.payment.paymentDate = new Date();
//   await registration.save();

//   // Sync with abstract workflow
//   const status = await AbstractStatus.findOne({ userId: registration.userId });
//   if (status) {
//     status.paymentStatus = "Paid";
//     await status.save();
//   }

//   res.json({ message: "Payment recorded successfully" });
// });


export const uploadFinalPaper = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const registration = await Registration.findOne({ userId });
  if (!registration) return res.status(404).json({ message: "Registration not found" });

  const { accommodation } = req.body;

  const status = await AbstractStatus.findOne({ userId });
  if (!status) return res.status(404).json({ message: "Abstract workflow not found" });

  if (status.abstractStatus !== "Approved") {
    return res.status(403).json({
      message:
        status.abstractStatus === "Rejected"
          ? `Abstract rejected. Reason: ${status.rejectedReason || "No reason provided"}`
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
  registration.accommodation=accommodation;
  await registration.save();

  // status.paperStatus = "submitted";
  if (registration) {
  // If registration exists, update abstract status
  await User.findByIdAndUpdate(
    userId,
    { paperStatus: "Submitted" },
    { new: true }
  );

  await AbstractStatus.findOneAndUpdate(
    { userId },
    { paperStatus: "Submitted"},
    { new: true, upsert: true }
  );
} else {
  // No registration -> make sure statuses are set to "No abstract" and "No paper"
  await AbstractStatus.findOneAndUpdate(
    { userId },
    { paperStatus: "No paper", paymentStatus: "Unpaid" },
    { new: true, upsert: true }
  );
    await User.findByIdAndUpdate(
    userId,
    { paperStatus: "No paper", paymentStatus: "Unpaid" },
    { new: true }
  );
}
  // await status.save();

  // ----------------------------
  // Fee Calculation
  // ----------------------------
  const firstParticipant = registration.participants[0];
  const designation = firstParticipant.designation.toLowerCase();

  const abstractSubmitDate = registration.createdAt || new Date();
  const earlyDeadline = new Date(process.env.EARLY_BIRD_DEADLINE);
  const isEarly = abstractSubmitDate <= earlyDeadline;

  let amount = 0;
  if (designation === "student") {
    amount = isEarly
      ? parseFloat(process.env.EARLY_STUDENT || 5000)
      : parseFloat(process.env.AMOUNT_STUDENT || 10000);
  } else if (designation === "researcher") {
    amount = isEarly
      ? parseFloat(process.env.EARLY_RESEARCHER || 10000)
      : parseFloat(process.env.AMOUNT_RESEARCHER || 12000);
  } else if (designation === "faculty") {
    amount = isEarly
      ? parseFloat(process.env.EARLY_FACULTY || 11000)
      : parseFloat(process.env.AMOUNT_FACULTY || 13000);
  } else if (designation === "industry") {
    amount = isEarly
      ? parseFloat(process.env.EARLY_INDUSTRY || 13000)
      : parseFloat(process.env.AMOUNT_INDUSTRY || 15000);
  }

  if (status.discount && designation === "student") {
    amount = parseFloat(process.env.DISCOUNTED_STUDENT_AMOUNT || amount);
  }

  // ✅ ensure payment object exists
  if (!registration.payment) {
    registration.payment = {};
  }
  registration.payment.amountPaid = amount;
  registration.payment.currency = process.env.CURRENCY || "INR";
  await registration.save();

  res.json({
    message: "Final paper uploaded successfully. Proceed to payment.",
    paperUrl: registration.paperUrl,
    amount,
    accommodation,
    currency: registration.payment.currency,
    redirectUrl: `/api/payments/create-order?userId=${userId}&amount=${amount}&currency=${registration.payment.currency}`,
  });
});

// ----------------------------
// Create PhonePe Payment Order
// ----------------------------
export const createPhonePeOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const registration = await Registration.findOne({ userId });
  if (!registration) {
    return res.status(404).json({ message: "Registration not found" });
  }

  const amount = registration.payment?.amountPaid;
  if (!amount) {
    return res.status(400).json({ message: "Amount not set. Upload final paper first." });
  }

  const transactionId = `TXN_${userId}_${Date.now()}`;

  // ✅ Save transactionId
  if (!registration.payment) {
    registration.payment = {};
  }
  registration.payment.transactionId = transactionId;
  await registration.save();

  const payload = {
    merchantId: PHONEPE_MERCHANT_ID,
    transactionId,
    merchantUserId: userId,
    amount: amount * 100, // in paise
    redirectUrl: `https://yourdomain.com/payment/success`,
    callbackUrl: `https://yourdomain.com/api/payments/phonepe/callback`,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");
  const saltKey = PHONEPE_MERCHANT_SECRET;
  const checksum = crypto
    .createHash("sha256")
    .update(payloadBase64 + "/pg/v1/pay" + saltKey)
    .digest("hex");

  const headers = {
    "Content-Type": "application/json",
    "X-VERIFY": checksum + "###1",
  };

  try {
    const response = await axios.post(
      `${PHONEPE_BASE_URL}/pg/v1/pay`,
      { request: payloadBase64 },
      { headers }
    );

    if (response.data.success) {
      res.json({
        message: "PhonePe order created",
        redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
      });
    } else {
      res.status(400).json({ message: "PhonePe order creation failed", details: response.data });
    }
  } catch (err) {
    res.status(500).json({ message: "PhonePe API error", error: err.message });
  }
});

// ----------------------------
// PhonePe Callback
// ----------------------------
export const phonePeCallback = asyncHandler(async (req, res) => {
  const { transactionId, code } = req.body;

  if (code !== "PAYMENT_SUCCESS") {
    return res.status(400).json({ message: "Payment failed", details: req.body });
  }

  const registration = await Registration.findOne({ "payment.transactionId": transactionId });
  if (!registration) {
    return res.status(404).json({ message: "Registration not found for transaction" });
  }

  registration.payment.paymentStatus = "paid";
  registration.payment.paymentDate = new Date();
  await registration.save();

  const status = await AbstractStatus.findOne({ userId: registration.userId });
  if (status) {
    status.paymentStatus = "Paid";
    await status.save();
  }

  res.json({ message: "Payment recorded successfully" });
});