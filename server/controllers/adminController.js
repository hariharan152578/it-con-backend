

import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import AbstractStatus from "../models/abstractStatusModel.js";
import Registration from "../models/registerModel.js";
import { generateToken } from "../middleware/authMiddleware.js";
import { sendEmail } from "../config/email.js";
import emailTemplate from "../config/emailTemplate.js";
import {saveFileLocally}  from "../config/filehelper.js";
import { countryCodes,fetchInrToCurrencyRates } from "../config/payment.js";

// --------------------------
// Admin Registration
// --------------------------
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
      role: admin.role,
    });
  } else {
    res.status(400).json({ message: "Invalid admin data" });
  }
});

// --------------------------
// Admin Login
// --------------------------
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

// --------------------------
// Get All Users
// --------------------------
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

        registration: registration || null,

        workflow: abstractStatus
          ? abstractStatus
          : {
              abstractStatus: "no abstract",
              paperStatus: "no paper",
              paymentStatus: "unpaid",
            },
      };
    })
  );

  res.json(userData);
});

// export const updateAbstractAndPaper = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const {
//       abstractStatus,
//       abstractrejectedReason,
//       paperrejectedReason,
//       discount,
//       paperAction,
//     } = req.body;
//     const file = req.file;

//     // ---------------- Fetch Records ----------------
//     const user = await User.findById(userId);
//     // console.log(user);
    
//     if (!user) return res.status(404).json({ message: "User not found" });
//    const abstractStatusRecord = await AbstractStatus.findOne({ userId });
//     if (!abstractStatusRecord) {
//       return res.status(404).json({ message: "Abstract status record not found" });
//     }
   
    
//     const registration =
//       (await Registration.findOne({ userId })) ||
//       new Registration({ userId, uniqueId: user.userId });
//     const status =
//       (await AbstractStatus.findOne({ userId })) ||
//       new AbstractStatus({ userId });

//     // =====================================================
//     // 🧾 ABSTRACT STATUS UPDATE
//     // =====================================================
//     if (abstractStatus) {
//       const normalizedStatus =
//         abstractStatus.charAt(0).toUpperCase() +
//         abstractStatus.slice(1).toLowerCase();

//       status.abstractStatus = normalizedStatus;
//       status.abstractApprovedBy = req.user._id;

//       await Promise.all([
//         User.findByIdAndUpdate(userId, { abstractStatus: normalizedStatus }),
//         Registration.findOneAndUpdate({ userId }, { abstractStatus: normalizedStatus }),
//       ]);

//       // Rejected Abstract
//       if (normalizedStatus === "Rejected") {
//         status.abstractrejectedReason = abstractrejectedReason || "Abstract Rejected";
//         status.paperStatus = "No Paper";
//         status.paymentStatus = "Unpaid";

//         await Promise.all([
//           User.findByIdAndUpdate(userId, {
//             paperStatus: "No Paper",
//             paymentStatus: "unpaid",
//           }),
//           Registration.findOneAndUpdate(
//             { userId },
//             { paperStatus: "No Paper", paymentStatus: "unpaid" }
//           ),
//         ]);
//       }

//       // Approved Abstract
//       if (normalizedStatus === "Approved") {
//         status.abstractrejectedReason = null;
//       }

 
// // --- Send Abstract Email ---

//  if (user?.email) {
//       let subject, message;

//       if (normalizedStatus === "Rejected") {
//         subject = `Abstract ${normalizedStatus} ❌`;
//         message = `
//           We regret to inform you that your abstract has been <b>${normalizedStatus}</b>.<br/><br/>
//           <i>Reason: ${status.abstractrejectedReason}</i><br/><br/>.
//         `;
//       } else if (normalizedStatus === "Approved") {
//         subject = `Abstract ${normalizedStatus} ✅`;
//         message = `
//           Congratulations! Your abstract has been <b>${normalizedStatus}</b>.<br/><br/>
//           You may now proceed to the final paper submission.
//         `;
//       } else {
//         subject = `Abstract ${normalizedStatus}`;
//         message = `Your abstract status has been updated to <b>${normalizedStatus}</b>.`;
//       }

     
//       await sendEmail({
//         to: user.email,
//         subject,
//         html: emailTemplate(
        
//   subject,               // title
//     message,               // message
//     user.name,             // userName
//     user.email,            // userEmail
//     user.userId,           // userId
//     normalizedStatus,      // userAbstract ✅
//     undefined,             // finalPaperStatus
//     undefined,             // paymentStatus
//    status.abstractrejectedReason, // rejectedReason ✅
//     undefined              // resetLink
          
//         ),
//       });
//     }
//       await status.save();
    
//   }
//     // =====================================================
//     // 📄 PAPER STATUS UPDATE
//     // =====================================================
//     if (paperAction) {
//       const normalizedStatus =
//         paperAction.toLowerCase() === "correction required"
//           ? "Correction Required"
//           : paperAction.charAt(0).toUpperCase() + paperAction.slice(1).toLowerCase();

//       status.paperStatus = normalizedStatus;
//       status.paperReviewedBy = req.user._id;
//       status.paperReviewDate = new Date();

//       // Update User & Registration
//       await Promise.all([
//         User.findByIdAndUpdate(userId, { paperStatus: normalizedStatus }),
//         Registration.findOneAndUpdate({ userId }, { paperStatus: normalizedStatus }),
//       ]);

//       // === CASE 1: REJECTED ===
//       if (normalizedStatus === "Rejected") {
//         status.paperrejectedReason = paperrejectedReason || "Paper Rejected";
//         status.paymentStatus = "Unpaid";
//         status.discount = false;

//         await Promise.all([
//           User.findByIdAndUpdate(userId, { paymentStatus: "unpaid" }),
//           Registration.findOneAndUpdate({ userId }, { paymentStatus: "unpaid" }),
//         ]);
//       }

//       // === CASE 2: APPROVED ===
   
// else if (normalizedStatus === "Approved") {
//   status.paperrejectedReason = null;
//   status.discount = discount ?? false;

//   // ✅ Find registration & user
//   const registration = await Registration.findOne({ userId: user._id });
//   if (!registration) throw new Error("Registration not found");

//   const mainParticipant = registration.participants?.[0];
//   const role = mainParticipant?.designation?.toLowerCase();
//   const mobilecode = user.mobilenocountrycode || "+91";
//   const currency = countryCodes[mobilecode] || "INR";
//   const amount=registration.payment.amountPaid || 0;
//   const amountconvert=registration.payment.convertedAmount || 0;
//   const isEarly=abstractStatusRecord.earlyBirdDiscount || false;
//   console.log(amount,isEarly);
  
//   // ------------------ Base Amount ------------------
//   let baseAmountInINR = 0;
  
//   if (isEarly) {
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
//     switch (role)  {
//     case "student":
//       baseAmountInINR = status.discount
//         ? parseInt(process.env.DISCOUNTED_STUDENT_AMOUNT, 10)
//         : parseInt(process.env.AMOUNT_STUDENT, 10);
//       break;
//     case "researcher":
//       baseAmountInINR = parseInt(process.env.AMOUNT_RESEARCHER, 10);
//       break;
//     case "faculty":
//       baseAmountInINR = parseInt(process.env.AMOUNT_FACULTY, 10);
//       break;
//     case "industry":
//       baseAmountInINR = parseInt(process.env.AMOUNT_INDUSTRY, 10);
//       break;
//     default:
//       baseAmountInINR = 0;
//   }
//   }
//   // ------------------ Convert to user currency ------------------
//   console.log(baseAmountInINR);
  
//  const convertedAmount = parseFloat((baseAmountInINR * inrToCurrency[mobilecode]).toFixed(2));

//   console.log(`💰 Base INR: ${baseAmountInINR} → Converted: ${convertedAmount}`);

//   console.log(`💰 Base INR: ${baseAmountInINR} → Converted: ${convertedAmount} ${currency}`);

//   // ------------------ Update registration payment info ------------------
// registration.payment.amountPaid = 
//   registration.payment.amountPaid && registration.payment.amountPaid !== 0
//     ? registration.payment.amountPaid
//     : baseAmountInINR;
//   registration.payment.convertedAmount && registration.payment.convertedAmount !== 0
//     ? registration.payment.convertedAmount
//     : convertedAmount;
//   registration.payment.currency = currency;
//   registration.payment.paymentStatus = "unpaid";
//   registration.payment.paymentMethod = "razorpay";
//   registration.payment.paymentDate = null;

//   await registration.save();

//   console.log(`✅ Fee set for ${role}: ₹${baseAmountInINR} (${currency} ${convertedAmount})`);
// }
//       // === CASE 3: CORRECTION REQUIRED ===
// else if (normalizedStatus === "Correction Required") {
//   if (!file) {
//     return res.status(400).json({ message: "Correction file required" });
//   }

//   // ✅ Save correction file locally
//   const correctedUrl = saveFileLocally("corrected", file, `corrected_${userId}`);

//   // ✅ Update status fields
//   status.correctedPaperUrl = correctedUrl;
//   status.paperrejectedReason = paperrejectedReason || "Requires correction";
//   status.paymentStatus = "unpaid";
//   status.correctionsRequested = (status.correctionsRequested || 0) + 1;
//   status.discount = false;
//   status.paperStatus = "Correction Required";

//   // ✅ Update User and Registration models
//   await Promise.all([
//     // Update User
//     User.findByIdAndUpdate(
//       userId,
//       {
//         paperStatus: "Correction Required", // explicitly set normalized value
//         paymentStatus: "Unpaid",            // reset payment for resubmission
//       },
//       { new: true }
//     ),

//     // Update Registration
//     Registration.findOneAndUpdate(
//       { userId },
//       {
//         correctedPaperUrl: correctedUrl,
//         "payment.paymentStatus": "unpaid", // update nested payment field
//         paperStatus: "Correction Required", // keep consistent with user
//       },
//       { new: true }
//     ),
//   ]);

//   console.log(`📄 Correction uploaded for User: ${userId}`);
// }

//       // --- Save all updates ---
//       await Promise.all([status.save(), registration.save()]);

//       // --- Send Paper Email ---
//       if (user.email) {
//         let subject, message;
//         if (normalizedStatus === "Rejected") {
//           subject = `Paper ${normalizedStatus} ❌`;
//           message = `Your paper has been <b>${normalizedStatus}</b>. Reason: ${status.paperrejectedReason}`;
//         } else if (normalizedStatus === "Approved") {
//           subject = `Paper ${normalizedStatus} ✅`;
//           message = `Your paper has been <b>${normalizedStatus}</b>. Congratulations!`;
//         } else {
//           subject = `Paper ${normalizedStatus}`;
//           message = `Your paper status has been updated to <b>${normalizedStatus}</b>.`;
//         }

        
//       await sendEmail({
//         to: user.email,
//         subject,
//         html: emailTemplate(
        
//   subject,               // title
//     message,               // message
//     user.name,             // userName
//     user.email,            // userEmail
//     user.userId,
//     undefined,           // userId
//     normalizedStatus,      // userAbstract ✅            // finalPaperStatus
//     undefined,             // paymentStatus
//     status.paperrejectedReason, // rejectedReason ✅
//     undefined              // resetLink
          
//         ),
//       });
//       }

//       return res.json({
//         success: true,
//         message: `Paper status updated to ${normalizedStatus}`,
//         discountApplied: status.discount || false,
//       });
//     }

//     // =====================================================
//     // ✅ FINAL RESPONSE
//     // =====================================================
//     res.json({
//       success: true,
//       message: "User abstract/paper updated successfully",
//       abstractStatus: status.abstractStatus,
//       paperStatus: registration?.paperStatus,
//     });
//   }catch (error) {
//     console.error("❌ Admin Update Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// }

export const updateAbstractAndPaper = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const {
    abstractStatus,
    abstractrejectedReason,
    paperrejectedReason,
    discount,
    paperAction,
  } = req.body;
  const file = req.file;

  try {
    // ---------------- Fetch main records in parallel ----------------
    const [user, abstractStatusRecord, registration] = await Promise.all([
      User.findById(userId),
      AbstractStatus.findOne({ userId }),
      Registration.findOne({ userId }),
    ]);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!abstractStatusRecord)
      return res
        .status(404)
        .json({ message: "Abstract status record not found" });

    const status = abstractStatusRecord;
    const reg = registration || new Registration({ userId, uniqueId: user.userId });

    // =====================================================
    // 🧾 ABSTRACT STATUS UPDATE
    // =====================================================
    if (abstractStatus) {
      const normalizedStatus =abstractStatus.toLowerCase();
        // abstractStatus.charAt(0).toUpperCase() +
        // abstractStatus.slice(1).toLowerCase();

      status.abstractStatus = normalizedStatus;
      status.abstractApprovedBy = req.user._id;

      const commonUpdates = [
        User.findByIdAndUpdate(userId, { abstractStatus: normalizedStatus }),
        Registration.findOneAndUpdate({ userId }, { abstractStatus: normalizedStatus }),
      ];

      if (normalizedStatus === "rejected") {
        status.abstractrejectedReason = abstractrejectedReason || "abstract rejected";
        status.paperStatus = "no paper";
        status.paymentStatus = "unpaid";
        commonUpdates.push(
          User.findByIdAndUpdate(userId, {
            paperStatus: "no paper",
            paymentStatus: "unpaid",
          }),
          Registration.findOneAndUpdate(
            { userId },
            { paperStatus: "no paper", paymentStatus: "unpaid" }
          )
        );
      } else if (normalizedStatus === "approved") {
        status.abstractrejectedReason = null;
      }

      await Promise.all([...commonUpdates, status.save()]);

      // ✅ Send Abstract Email
      if (user.email) {
        const subject =
          normalizedStatus === "rejected"
            ? `Abstract ${normalizedStatus} ❌`
            : `Abstract ${normalizedStatus} ✅`;
        const message =
          normalizedStatus === "rejected"
            ? `We regret to inform you that your abstract has been <b>${normalizedStatus}</b>.<br/><br/>
               <i>Reason: ${status.abstractrejectedReason}</i><br/><br/>`
            : `Congratulations! Your abstract has been <b>${normalizedStatus}</b>.<br/><br/>
               You may now proceed to final paper submission.`;

        await sendEmail({
          to: user.email,
          subject,
          html: emailTemplate(
            subject,
            message,
            user.name,
            user.email,
            user.userId,
            normalizedStatus,
            undefined,
            undefined,
            status.abstractrejectedReason,
            undefined
          ),
        });
      }
    }

    // =====================================================
    // 📄 PAPER STATUS UPDATE
    // =====================================================
    if (paperAction) {
      const normalizedStatus =
        paperAction.toLowerCase() === "correction required"
          ? "correction required"
          : paperAction.toLowerCase();

      status.paperStatus = normalizedStatus;
      status.paperReviewedBy = req.user._id;
      status.paperReviewDate = new Date();

      const commonUpdates = [
        User.findByIdAndUpdate(userId, { paperStatus: normalizedStatus }),
        Registration.findOneAndUpdate({ userId }, { paperStatus: normalizedStatus }),
      ];

      if (normalizedStatus === "rejected") {
        status.paperrejectedReason = paperrejectedReason || "paper rejected";
        status.paymentStatus = "unpaid";
        status.discount = false;
        commonUpdates.push(
          User.findByIdAndUpdate(userId, { paymentStatus: "unpaid" }),
          Registration.findOneAndUpdate({ userId }, { paymentStatus: "unpaid" })
        );
      }

      // else if (normalizedStatus === "approved") {
      //   status.paperrejectedReason = null;
      //   status.discount = discount ?? false;

      //   const mainParticipant = reg.participants?.[0];
      //   const role = mainParticipant?.designation?.toLowerCase() || "student";
      //   const mobilecode = user.mobilenocountrycode || "+91";
      //   const currency = countryCodes[mobilecode] || "INR";
      //   const isEarly = abstractStatusRecord.earlyBirdDiscount || false;

      //   // --- Compute Fee ---
      //   const feeConfig = {
      //     student: [process.env.AMOUNT_STUDENT, process.env.EARLY_STUDENT],
      //     researcher: [process.env.AMOUNT_RESEARCHER, process.env.EARLY_RESEARCHER],
      //     faculty: [process.env.AMOUNT_FACULTY, process.env.EARLY_FACULTY],
      //     industry: [process.env.AMOUNT_INDUSTRY, process.env.EARLY_INDUSTRY],
      //   };
      //   const [normal, early] = feeConfig[role] || [0, 0];
      //   const baseAmountInINR = isEarly
      //     ? parseInt(early, 10)
      //     : status.discount
      //     ? parseInt(process.env.DISCOUNTED_STUDENT_AMOUNT, 10)
      //     : parseInt(normal, 10);

      //   const convertedAmount = parseFloat(
      //     (baseAmountInINR * inrToCurrency[mobilecode]).toFixed(2)
      //   );

      //   // --- Update Registration Payment ---
      //   reg.payment = {
      //     amountPaid: baseAmountInINR,
      //     convertedAmount: convertedAmount,
      //     currency,
      //     paymentStatus: "unpaid",
      //     paymentMethod: "razorpay",
      //     paymentDate: null,
      //   };

      //   commonUpdates.push(reg.save());
      // }

      else if (normalizedStatus === "approved") {
  status.paperrejectedReason = null;
  status.discount = discount ?? false;

  const mainParticipant = reg.participants?.[0];
  const role = mainParticipant?.designation?.toLowerCase() || "student";
  const mobilecode = user.mobilenocountrycode || "+91";
  const currency = countryCodes[mobilecode] || "INR";
  const isEarly = abstractStatusRecord.earlyBirdDiscount || false;

  // 🔹 Fetch live conversion
  const inrToCurrency = await fetchInrToCurrencyRates();
  const rate = inrToCurrency[mobilecode] || 1;

  const feeConfig = {
    student: [process.env.AMOUNT_STUDENT, process.env.EARLY_STUDENT],
    researcher: [process.env.AMOUNT_RESEARCHER, process.env.EARLY_RESEARCHER],
    faculty: [process.env.AMOUNT_FACULTY, process.env.EARLY_FACULTY],
    industry: [process.env.AMOUNT_INDUSTRY, process.env.EARLY_INDUSTRY],
  };

  const [normal, early] = feeConfig[role] || [0, 0];
  const baseAmountInINR = isEarly
    ? parseInt(early, 10)
    : status.discount
    ? parseInt(process.env.DISCOUNTED_STUDENT_AMOUNT, 10)
    : parseInt(normal, 10);

  const convertedAmount = parseFloat((baseAmountInINR * rate).toFixed(2));

  reg.payment = {
    amountPaid: baseAmountInINR,
    convertedAmount,
    currency,
    paymentStatus: "unpaid",
    paymentMethod: "razorpay",
    paymentDate: null,
  };

  commonUpdates.push(reg.save());
}
      else if (normalizedStatus === "correction required") {
        if (!file) return res.status(400).json({ message: "Correction file required" });

        const correctedUrl = saveFileLocally("corrected", file, `corrected_${userId}`);
        status.correctedPaperUrl = correctedUrl;
        status.paperrejectedReason = paperrejectedReason || "requires correction";
        status.paymentStatus = "unpaid";
        status.correctionsRequested = (status.correctionsRequested || 0) + 1;
        status.discount = false;

        commonUpdates.push(
          User.findByIdAndUpdate(userId, {
            paperStatus: "correction required",
            paymentStatus: "unpaid",
          }),
          Registration.findOneAndUpdate(
            { userId },
            {
              correctedPaperUrl: correctedUrl,
              "payment.paymentStatus": "unpaid",
              paperStatus: "correction required",
            }
          )
        );
      }

      await Promise.all([...commonUpdates, status.save()]);

      // ✅ Send Paper Email
      if (user.email) {
        const subject =
          normalizedStatus === "rejected"
            ? `Paper Rejected ❌`
            : `Paper ${normalizedStatus.toUpperCase()} ✅`;
        const message =
          normalizedStatus === "rejected"
            ? `Your paper has been <b>rejected</b>. Reason: ${status.paperrejectedReason}`
            : `Your paper status is <b>${normalizedStatus}</b>.`;

        await sendEmail({
          to: user.email,
          subject,
          html: emailTemplate(
            subject,
            message,
            user.name,
            user.email,
            user.userId,
            undefined,
            normalizedStatus,
            undefined,
            status.paperrejectedReason,
            undefined
          ),
        });
      }

      return res.json({
        success: true,
        message: `Paper status updated to ${normalizedStatus}`,
        discountApplied: status.discount || false,
      });
    }

    // =====================================================
    // ✅ FINAL RESPONSE
    // =====================================================
    return res.json({
      success: true,
      message: "User abstract/paper updated successfully",
      abstractStatus: status.abstractStatus,
      paperStatus: reg?.paperStatus,
    });
  } catch (error) {
    console.error("❌ Admin Update Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});