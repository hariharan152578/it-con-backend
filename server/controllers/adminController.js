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
// Logout Admin
// ----------------------------
export const logoutAdmin = asyncHandler(async (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Admin logged out successfully" });
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

        abstractContent: registration?.abstractContent || null,
        abstractExpression: registration?.abstractExpression || null,
        abstractTitle: registration?.abstractTitle || null,
        address: registration?.address || null,
        country: registration?.country || null,
        currency: registration?.currency || "INR",
        participants: registration?.participants || [],
        pincode: registration?.pincode || null,
        track: registration?.track || null,
        presentationMode: registration?.presentationMode || null,

        abstractStatus: abstractStatus?.abstractStatus || "pending",
        finalPaperStatus: abstractStatus?.finalPaperStatus || "pending",

        paymentStatus: registration?.paymentStatus || "unpaid",
        paymentDate: registration?.paymentDate || null,
        amountPaid: registration?.amountPaid || 0,
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

    abstractContent: registration?.abstractContent || null,
    abstractExpression: registration?.abstractExpression || null,
    abstractTitle: registration?.abstractTitle || null,
    address: registration?.address || null,
    country: registration?.country || null,
    currency: registration?.currency || null,
    participants: registration?.participants || [],
    pincode: registration?.pincode || null,
    track: registration?.track || null,
    presentationMode: registration?.presentationMode || null,

    abstractStatus: abstractStatus?.abstractStatus || "pending",
    finalPaperStatus: abstractStatus?.finalPaperStatus || "pending",

    paymentStatus: registration?.paymentStatus || "unpaid",
    paymentDate: registration?.paymentDate || null,
    amountPaid: registration?.amountPaid || 0,
  });
});

// ----------------------------
// Update User Approval Workflow
// ----------------------------
export const updateUserApproval = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { abstractStatus, finalPaperStatus, paymentStatus, content } = req.body;

  const status = await AbstractStatus.findOne({ userId: id }).populate("userId", "name email");
  if (!status) return res.status(404).json({ message: "Status record not found" });

  const user = status.userId;

  // --- Abstract workflow ---
  if (abstractStatus) {
    status.abstractStatus = abstractStatus;
    status.abstractApprovedBy = req.user._id;

    await User.findByIdAndUpdate(id, { abstractStatus });
    await Registration.findOneAndUpdate({ userId: id }, { abstractStatus });

    if (user?.email) {
      let subject, message;

      if (abstractStatus.toLowerCase() === "rejected") {
        status.reason = content;
        status.abstractreasonBy = req.user._id;
        subject = `Abstract ${abstractStatus} ❌`;
        message = `
          We regret to inform you that your abstract has been <b>${abstractStatus}</b>.<br/><br/>
          <i>${content || "Please review the guidelines and resubmit your abstract."}</i>
        `;
      } else if (abstractStatus.toLowerCase() === "approved") {
        status.reason = null;
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

    if (abstractStatus.toLowerCase() === "rejected") {
      status.finalPaperStatus = "pending";
      status.paperApprovedBy = null;
      status.paymentStatus = "pending";
      status.paymentApprovedBy = null;

      await User.findByIdAndUpdate(id, { finalPaperStatus: "pending", paymentStatus: "unpaid" });
      await Registration.findOneAndUpdate({ userId: id }, { finalPaperStatus: "pending", paymentStatus: "unpaid" });
    }
  }

  // --- Final Paper workflow ---
  if (finalPaperStatus) {
    if (status.abstractStatus !== "approved") {
      return res.status(400).json({ message: "Final paper cannot be updated before abstract approval" });
    }

    status.finalPaperStatus = finalPaperStatus;
    status.paperApprovedBy = req.user._id;

    await User.findByIdAndUpdate(id, { finalPaperStatus });
    await Registration.findOneAndUpdate({ userId: id }, { finalPaperStatus });

    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: `Final Paper ${finalPaperStatus}`,
        text: `Hello ${user.name}, your final paper has been ${finalPaperStatus}.`,
        html: emailTemplate(`Final Paper ${finalPaperStatus}`, `Your Final Paper has been <b>${finalPaperStatus}</b>.`, user.name, undefined, undefined, undefined, finalPaperStatus),
      });
    }

    if (finalPaperStatus === "rejected") {
      status.paymentStatus = "pending";
      status.paymentApprovedBy = null;
      await User.findByIdAndUpdate(id, { paymentStatus: "unpaid" });
      await Registration.findOneAndUpdate({ userId: id }, { paymentStatus: "unpaid" });
    }
  }

  // --- Payment workflow ---
  if (paymentStatus) {
    if (status.finalPaperStatus !== "approved") {
      return res.status(400).json({ message: "Payment cannot be updated before final paper approval" });
    }

    status.paymentStatus = paymentStatus;
    status.paymentApprovedBy = req.user._id;

    await User.findByIdAndUpdate(id, { paymentStatus });
    await Registration.findOneAndUpdate({ userId: id }, { paymentStatus });

    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: `Payment ${paymentStatus}`,
        text: `Hello ${user.name}, your payment status is ${paymentStatus}.`,
        html: emailTemplate(`Payment ${paymentStatus}`, `Your payment status has been updated to <b>${paymentStatus}</b>.`, user.name, undefined, undefined, undefined, undefined, paymentStatus),
      });
    }
  }

  const updatedStatus = await status.save();
  res.json(updatedStatus);
});
