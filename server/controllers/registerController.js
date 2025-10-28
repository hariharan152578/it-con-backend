

// import fs from "fs";
// import path from "path";
// import dotenv from "dotenv";
// import asyncHandler from "express-async-handler";
// import { saveFileLocally } from "../config/filehelper.js";
// import  User  from "../models/userModel.js";
// import  Registration  from "../models/registerModel.js";
// import AbstractStatus  from "../models/abstractStatusModel.js";
// import { countryCodeMap, countryCodes,inrToCurrency   } from "../config/payment.js";
// dotenv.config();
// // ✅ Define upload directories globally
// const uploadDir = path.join(process.cwd(), "uploads");
// const paperDir = path.join(uploadDir, "papers");
// const proofDir = path.join(uploadDir, "proofs");

// // ✅ Ensure folders exist
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
// if (!fs.existsSync(paperDir)) fs.mkdirSync(paperDir, { recursive: true });
// if (!fs.existsSync(proofDir)) fs.mkdirSync(proofDir, { recursive: true });



// export const submitRegistration = asyncHandler(async (req, res) => {
//   const userId = req.user?.id;
//   if (!userId) return res.status(401).json({ message: "Unauthorized" });

//   let {
//     participants,
//     address,
//     track,
//     pincode,
//     abstractTitle,
//     abstractContent,
//     abstractExpression,
//     presentationMode,
//   } = req.body;

//   // ------------------ USER VALIDATION ------------------
//   const user = await User.findById(userId);
//   if (!user) return res.status(404).json({ message: "User not found" });

//   const mobilecode = user.mobilenocountrycode || "+91";
//   const country = countryCodeMap[mobilecode] || "India";
//   const currency = countryCodes[mobilecode] || "INR";

//   // ------------------ PARSE PARTICIPANTS ------------------
//   if (typeof participants === "string") participants = JSON.parse(participants);
//   if (!Array.isArray(participants) || participants.length < 1)
//     return res.status(400).json({ message: "Participants required" });

//   // ------------------ SAVE PROOF FILES ------------------
//   let proofUrls = [];
//   if (req.files && req.files.length > 0) {
//     proofUrls = req.files.map((file, index) =>
//       saveFileLocally("proofs", file, `proof_${userId}_${index}`)
//     );
//   }

//   participants = participants.map((p, i) => ({
//     ...p,
//     proofUrl: proofUrls[i] || null,
//   }));

//   // ------------------ EARLY BIRD & FEE CALCULATION ------------------
//   const today = new Date();
//   const earlyBirdDeadline = new Date(process.env.EARLY_BIRD_DEADLINE);
//   const isEarlyBird = today <= earlyBirdDeadline;
//   console.log(isEarlyBird,today,earlyBirdDeadline);
  
  
//   const mainParticipant = participants[0];
//   const role = mainParticipant?.designation?.toLowerCase() || "student";


//   let baseAmountInINR = 0;

//   if (isEarlyBird) {
//     switch (role) {
//       case "student":
//         baseAmountInINR = parseInt(process.env.EARLY_STUDENT, 10);
//         break;
//       case "researcher":
//         baseAmountInINR = parseInt(process.env.EARLY_RESEARCHER, 10);
//         break;
//       case "faculty":
//         baseAmountInINR = parseInt(process.env.EARLY_FACULTY, 10);
//         break;
//       case "industry":
//         baseAmountInINR = parseInt(process.env.EARLY_INDUSTRY, 10);
//         break;
//       default:
//         baseAmountInINR = 0;
//     }
//   } else {
//     switch (role) {
//       case "student":
//         baseAmountInINR = parseInt(process.env.AMOUNT_STUDENT, 10);
//         break;
//       case "researcher":
//         baseAmountInINR = parseInt(process.env.AMOUNT_RESEARCHER, 10);
//         break;
//       case "faculty":
//         baseAmountInINR = parseInt(process.env.AMOUNT_FACULTY, 10);
//         break;
//       case "industry":
//         baseAmountInINR = parseInt(process.env.AMOUNT_INDUSTRY, 10);
//         break;
//       default:
//         baseAmountInINR = 0;
//     }
//   }

//   // ------------------ CURRENCY CONVERSION ------------------
//   // const conversionRate = await getConversionRate(currency);
//  const convertedAmount = parseFloat((baseAmountInINR * inrToCurrency[mobilecode]).toFixed(2));

//   console.log(`💰 Base INR: ${baseAmountInINR} → Converted: ${convertedAmount}`);

//   // ------------------ SAVE / UPDATE REGISTRATION ------------------
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
//       earlyBirdDiscount: isEarlyBird,
//       payment: {
//         paymentMethod: "razorpay",
//         paymentStatus: "unpaid",
//         amountPaid: baseAmountInINR,
//         convertedAmount: convertedAmount,
//         currency,
//         country,
//         orderId: null,
//         paymentId: null,
//         paymentDate: null,
//       },
//     },
//     { new: true, upsert: true, runValidators: true }
//   );

//   // ------------------ UPDATE USER & ABSTRACT STATUS ------------------
//   await User.findByIdAndUpdate(userId, {
//     abstractStatus: "under review",
//     paymentStatus: "unpaid",
//     paperStatus: "No Paper",
//   });

//   await AbstractStatus.findOneAndUpdate(
//     { userId },
//     { abstractStatus: "submitted", rejectedReason: null ,earlyBirdDiscount: isEarlyBird},
//     { new: true, upsert: true }
//   );

//   res.status(201).json({
//     message: `Registration submitted successfully. ${
//       isEarlyBird ? "✅ Early bird discount applied." : "❌ Regular fee applies."
//     }`,
//     registration,
//   });
// });
// /* ==========================================================
//    ✅ UPLOAD FINAL PAPER (AFTER APPROVAL)
// ========================================================== */
// export const uploadFinalPaper = asyncHandler(async (req, res) => {
//   const userId = req.user?.id;
//   if (!userId) return res.status(401).json({ message: "Unauthorized" });

//   const registration = await Registration.findOne({ userId });
//   if (!registration)
//     return res.status(404).json({ message: "Registration not found" });

//   const { accommodation } = req.body;
//   const status = await AbstractStatus.findOne({ userId });

//   if (status?.abstractStatus === "Rejected")
//     return res.status(403).json({ message: "Abstract Rejected by Admin" });

//   if (!status || status.abstractStatus !== "Approved") {
//     return res.status(403).json({
//       message: "Abstract not approved yet by admin.",
//     });
//   }

//   if (!req.file)
//     return res.status(400).json({ message: "No paper file uploaded" });

//   // ✅ Save paper file to /uploads/papers/
//   const paperUrl = saveFileLocally("papers", req.file, `paper_${userId}`);

//   await Registration.findOneAndUpdate({ userId }, { paperUrl, accommodation });
//   await AbstractStatus.findOneAndUpdate({ userId }, { paperStatus: "submitted" });
//   await User.findByIdAndUpdate(userId, { paperStatus: "under review" });

//   res.json({
//     message: "Paper uploaded successfully and is under review.",
//     userId,
//     paperUrl,
//     accommodation,
//   });
// });


import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import { saveFileLocally } from "../config/filehelper.js";
import User from "../models/userModel.js";
import Registration from "../models/registerModel.js";
import AbstractStatus from "../models/abstractStatusModel.js";
import { countryCodeMap, countryCodes, fetchInrToCurrencyRates  } from "../config/payment.js";

dotenv.config();

// ✅ Ensure upload folders exist
const uploadDir = path.join(process.cwd(), "uploads");
const paperDir = path.join(uploadDir, "papers");
const proofDir = path.join(uploadDir, "proofs");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(paperDir)) fs.mkdirSync(paperDir, { recursive: true });
if (!fs.existsSync(proofDir)) fs.mkdirSync(proofDir, { recursive: true });

/* ==========================================================
   📝 SUBMIT REGISTRATION
========================================================== */
// export const submitRegistration = asyncHandler(async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ message: "Unauthorized" });

//     let {
//       participants,
//       address,
//       track,
//       pincode,
//       abstractTitle,
//       abstractContent,
//       abstractExpression,
//       presentationMode,
//     } = req.body;

//     // ------------------ USER VALIDATION ------------------
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const mobilecode = user.mobilenocountrycode || "+91";
//     const country = countryCodeMap[mobilecode] || "India";
//     const currency = countryCodes[mobilecode] || "INR";

//     // ------------------ PARSE PARTICIPANTS ------------------
//     if (typeof participants === "string") participants = JSON.parse(participants);
//     if (!Array.isArray(participants) || participants.length < 1)
//       return res.status(400).json({ message: "Participants required" });

//     // ------------------ SAVE PROOF FILES ------------------
//     let proofUrls = [];
//     if (req.files && req.files.length > 0) {
//       proofUrls = req.files.map((file, index) =>
//         saveFileLocally("proofs", file, `proof_${userId}_${index}`)
//       );
//     }

//     participants = participants.map((p, i) => ({
//       ...p,
//       proofUrl: proofUrls[i] || null,
//     }));

//     // ------------------ EARLY BIRD & FEE CALCULATION ------------------
//     const today = new Date();
//     const earlyBirdDeadline = new Date(process.env.EARLY_BIRD_DEADLINE);
//     const isEarlyBird = today <= earlyBirdDeadline;

//     const mainParticipant = participants[0];
//     const role = mainParticipant?.designation?.toLowerCase() || "student";

//     let baseAmountInINR = 0;
//     const getAmount = (type) => parseInt(process.env[type], 10) || 0;

//     if (isEarlyBird) {
//       switch (role) {
//         case "student":
//           baseAmountInINR = getAmount("EARLY_STUDENT");
//           break;
//         case "researcher":
//           baseAmountInINR = getAmount("EARLY_RESEARCHER");
//           break;
//         case "faculty":
//           baseAmountInINR = getAmount("EARLY_FACULTY");
//           break;
//         case "industry":
//           baseAmountInINR = getAmount("EARLY_INDUSTRY");
//           break;
//         default:
//           baseAmountInINR = 0;
//       }
//     } else {
//       switch (role) {
//         case "student":
//           baseAmountInINR = getAmount("AMOUNT_STUDENT");
//           break;
//         case "researcher":
//           baseAmountInINR = getAmount("AMOUNT_RESEARCHER");
//           break;
//         case "faculty":
//           baseAmountInINR = getAmount("AMOUNT_FACULTY");
//           break;
//         case "industry":
//           baseAmountInINR = getAmount("AMOUNT_INDUSTRY");
//           break;
//         default:
//           baseAmountInINR = 0;
//       }
//     }

//     // ------------------ CURRENCY CONVERSION ------------------
//     const convertedAmount = parseFloat(
//       (baseAmountInINR * inrToCurrency[mobilecode]).toFixed(2)
//     );

//     // ------------------ SAVE / UPDATE REGISTRATION ------------------
//     const registration = await Registration.findOneAndUpdate(
//       { userId },
//       {
//         uniqueId: user.userId,
//         participants,
//         address,
//         country,
//         track,
//         pincode,
//         abstractTitle,
//         abstractContent,
//         abstractExpression,
//         presentationMode,
//         earlyBirdDiscount: isEarlyBird,
//         payment: {
//           paymentMethod: "razorpay",
//           paymentStatus: "unpaid",
//           amountPaid: baseAmountInINR,
//           convertedAmount,
//           currency,
//           country,
//           orderId: null,
//           paymentId: null,
//           paymentDate: null,
//         },
//       },
//       { new: true, upsert: true, runValidators: true }
//     );

//     // ------------------ UPDATE USER & ABSTRACT STATUS ------------------
//     await Promise.all([
//       User.findByIdAndUpdate(userId, {
//         abstractStatus: "submitted",
//         paymentStatus: "unpaid",
//         paperStatus: "no paper",
//       }),
//       AbstractStatus.findOneAndUpdate(
//         { userId },
//         {
//           abstractStatus: "submitted",
//           abstractrejectedReason: null,
//           earlyBirdDiscount: isEarlyBird,
//         },
//         { new: true, upsert: true }
//       ),
//     ]);

//     res.status(201).json({
//       message: `Registration submitted successfully. ${
//         isEarlyBird ? "✅ Early bird discount applied." : "❌ Regular fee applies."
//       }`,
//       registration,
//     });
//   } catch (error) {
//     console.error("❌ Registration Error:", error);
//     res.status(500).json({
//       message: "Registration failed",
//       error: error.message,
//     });
//   }
// });


export const submitRegistration = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    let {
      participants,
      address,
      track,
      pincode,
      abstractTitle,
      abstractContent,
      abstractExpression,
      presentationMode,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const mobilecode = user.mobilenocountrycode || "+91";
    const country = countryCodeMap[mobilecode] || "India";
    const currency = countryCodes[mobilecode] || "INR";

    if (typeof participants === "string") participants = JSON.parse(participants);
    if (!Array.isArray(participants) || participants.length < 1)
      return res.status(400).json({ message: "Participants required" });

    let proofUrls = [];
    if (req.files?.length) {
      proofUrls = req.files.map((file, i) =>
        saveFileLocally("proofs", file, `proof_${userId}_${i}`)
      );
    }

    participants = participants.map((p, i) => ({
      ...p,
      proofUrl: proofUrls[i] || null,
    }));

    const today = new Date();
    const earlyBirdDeadline = new Date(process.env.EARLY_BIRD_DEADLINE);
    const isEarlyBird = today <= earlyBirdDeadline;

    const mainParticipant = participants[0];
    const role = mainParticipant?.designation?.toLowerCase() || "student";

    const getAmount = (type) => parseInt(process.env[type], 10) || 0;
    let baseAmountInINR = 0;

    if (isEarlyBird) {
      baseAmountInINR =
        getAmount(
          `EARLY_${role.toUpperCase()}`
        ) || getAmount("EARLY_STUDENT");
    } else {
      baseAmountInINR =
        getAmount(
          `AMOUNT_${role.toUpperCase()}`
        ) || getAmount("AMOUNT_STUDENT");
    }

    // 🔹 Fetch live or fallback rates
    const inrToCurrency = await fetchInrToCurrencyRates();
    const conversionRate = inrToCurrency[mobilecode] || 1;
    const convertedAmount = parseFloat((baseAmountInINR * conversionRate).toFixed(2));

    // 🔹 Save or update registration
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
        presentationMode,
        earlyBirdDiscount: isEarlyBird,
        payment: {
          paymentMethod: "razorpay",
          paymentStatus: "unpaid",
          amountPaid: baseAmountInINR,
          convertedAmount,
          currency,
          country,
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    await Promise.all([
      User.findByIdAndUpdate(userId, {
        abstractStatus: "submitted",
        paymentStatus: "unpaid",
        paperStatus: "no paper",
      }),
      AbstractStatus.findOneAndUpdate(
        { userId },
        {
          abstractStatus: "submitted",
          abstractrejectedReason: null,
          earlyBirdDiscount: isEarlyBird,
        },
        { new: true, upsert: true }
      ),
    ]);

    res.status(201).json({
      message: `Registration submitted successfully. ${
        isEarlyBird ? "✅ Early bird discount applied." : "❌ Regular fee applies."
      }`,
      registration,
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

/* ==========================================================
   📄 UPLOAD FINAL PAPER (AFTER APPROVAL)
========================================================== */
export const uploadFinalPaper = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const registration = await Registration.findOne({ userId });
    if (!registration)
      return res.status(404).json({ message: "Registration not found" });

    const { accommodation } = req.body;
    const status = await AbstractStatus.findOne({ userId });

    if (status?.abstractStatus === "rejected")
      return res.status(403).json({ message: "Abstract rejected by admin" });

    if (!status || status.abstractStatus !== "approved") {
      return res.status(403).json({
        message: "Abstract not approved yet by admin.",
      });
    }

    if (!req.file)
      return res.status(400).json({ message: "No paper file uploaded" });

    // ✅ Save paper file
    const paperUrl = saveFileLocally("papers", req.file, `paper_${userId}`);

    await Promise.all([
      Registration.findOneAndUpdate({ userId }, { paperUrl, accommodation }),
      AbstractStatus.findOneAndUpdate({ userId }, { paperStatus: "submitted" }),
      User.findByIdAndUpdate(userId, { paperStatus: "submitted" }),
    ]);

    res.json({
      message: "Paper uploaded successfully and is submitted.",
      userId,
      paperUrl,
      accommodation,
    });
  } catch (error) {
    console.error("❌ Upload Paper Error:", error);
    res.status(500).json({
      message: "Failed to upload final paper",
      error: error.message,
    });
  }
});
