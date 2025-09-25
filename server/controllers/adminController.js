import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import AbstractStatus from "../models/abstractStatusModel.js";
import Registration from "../models/registerModel.js";
import { generateToken } from "../middleware/authMiddleware.js";
import { sendEmail } from "../config/email.js";
import { emailTemplate } from "../config/emailTemplate.js";
// Register Admin
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
      role:admin.role,
    });
  } else {
    res.status(400).json({ message: "Invalid admin data" });
  }
});


// Login Admin
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


// Get all users
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
        email:user.email,
        mobileno:user.mobileno,

        // 🔹 Registration Details
    registration: registration
      ? {
          _id: registration._id,
          uniqueId: registration.uniqueId,
          participants: registration.participants,
          country: registration.country,
          pincode:registration.pincode,
          track: registration.track,
          presentationMode: registration.presentationMode,
          abstractTitle: registration.abstractTitle,
          abstractContent:registration.abstractContent,
          proofUrl: registration.proofUrl,
          paperUrl: registration.paperUrl,
          abstractExpression:registration.abstractExpression,
          address:registration.address,
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
          abstractStatus: "No Abstract",
          paperStatus: "No Paper",
          paymentStatus: "unpaid",
        },
      };
    })
  );

  res.json(userData);
});

// Update User Approval Workflow

export const updateUserApproval = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { abstractStatus, rejectedReason, discount } = req.body;

  const status = await AbstractStatus.findOne({ userId: id }).populate("userId", "name email userId");
  if (!status) return res.status(404).json({ message: "Status record not found" });

  const user = status.userId; // ✅ populated user

  // --------------------------
  // Abstract workflow
  // --------------------------
  if (abstractStatus) {
    const normalizedStatus =
      abstractStatus.charAt(0).toUpperCase() + abstractStatus.slice(1).toLowerCase(); // e.g. "Approved"

    status.abstractStatus = normalizedStatus;
    status.abstractApprovedBy = req.user._id;

    await User.findByIdAndUpdate(id, { abstractStatus: normalizedStatus });

    if (normalizedStatus === "Rejected") {
      status.rejectedReason = rejectedReason || "Paper Rejected";

      // Reset dependent statuses
      status.discount = false;
      status.paperStatus = "No Paper";
      status.paymentStatus = "Unpaid";

      await User.findByIdAndUpdate(id, {
        paperStatus: "No Paper",
        paymentStatus: "Unpaid",
      });
    }

    if (normalizedStatus === "Approved") {
      status.rejectedReason = null;
      status.discount = discount ?? false;
    }

    // ✉️ Email notification
    if (user?.email) {
      let subject, message;

      if (normalizedStatus === "Rejected") {
        subject = `Abstract ${normalizedStatus} ❌`;
        message = `
          We regret to inform you that your abstract has been <b>${normalizedStatus}</b>.<br/><br/>
          <i>Reason: ${status.rejectedReason}</i><br/><br/>
          Please review the guidelines and resubmit your abstract if possible.
        `;
      } else if (normalizedStatus === "Approved") {
        subject = `Abstract ${normalizedStatus} ✅`;
        message = `
          Congratulations! Your abstract has been <b>${normalizedStatus}</b>.<br/><br/>
          You may now proceed to the final paper submission.
        `;
      } else {
        subject = `Abstract ${normalizedStatus}`;
        message = `Your abstract status has been updated to <b>${normalizedStatus}</b>.`;
      }

      await sendEmail({
        to: user.email,
        subject,
        text: `Hello ${user.name}, ${message.replace(/<[^>]+>/g, "")}`, // plain text
        html: emailTemplate(
          subject,
          message,
          user.name,
          user.email,
          user.userId,
          normalizedStatus,
          undefined,
          undefined,
          status.rejectedReason
        ),
      });
    }

    await status.save();
  }

  // --------------------------
  // Future: Add Paper workflow + Payment workflow
  // --------------------------

  res.json(status);
});

