import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import Registration from "../models/registerModel.js";
import AbstractStatus from "../models/abstractStatusModel.js";
import User from "../models/userModel.js";

// ------------------ Folder ------------------
const correctionDir = path.join(process.cwd(), "uploads", "corrections");
if (!fs.existsSync(correctionDir)) fs.mkdirSync(correctionDir, { recursive: true });

// ------------------ Helper ------------------
const saveFileLocally = (folder, file, prefix) => {
  const extension = path.extname(file.originalname);
  const fileName = `${prefix}_${Date.now()}${extension}`;
  const filePath = path.join(folder, fileName);
  fs.writeFileSync(filePath, file.buffer);
  return `/uploads/${folder.split("uploads/")[1]}/${fileName}`;
};

// ------------------ Mail Setup ------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendStatusMail = async (email, subject, html) => {
  await transporter.sendMail({
    from: `"Conference Admin" <${process.env.MAIL_USER}>`,
    to: email,
    subject,
    html,
  });
};

// ------------------ ADMIN REVIEW ------------------
export const adminReviewPaper = asyncHandler(async (req, res) => {
  const adminId = req.user?.id;
  const { userId } = req.params;
  const { status, reason } = req.body;

  if (!["Approved", "Rejected", "Correction Required"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  const user = await User.findById(userId);
  const registration = await Registration.findOne({ userId });
  if (!user || !registration)
    return res.status(404).json({ message: "User not found" });

  const updatedStatus = await AbstractStatus.findOneAndUpdate(
    { userId },
    {
      paperStatus: status,
      rejectedReason: reason || null,
      lastReviewedBy: adminId,
      lastReviewedAt: new Date(),
    },
    { new: true }
  );

  await User.findByIdAndUpdate(userId, { paperStatus: status });

  let subject = `Paper Review Update - ${status}`;
  let html = "";

  if (status === "Approved")
    html = `<p>Congratulations! Your paper has been approved for publication.</p>`;
  else if (status === "Rejected")
    html = `<p>We regret to inform that your paper was rejected. Reason: <b>${reason}</b></p>`;
  else
    html = `<p>Your paper needs corrections. Please upload the corrected paper.</p>`;

  await sendStatusMail(user.email, subject, html);

  res.json({
    message: `Paper ${status.toLowerCase()} successfully.`,
    updatedStatus,
  });
});

// ------------------ USER UPLOAD CORRECTED PAPER ------------------
export const userUploadCorrectionPaper = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const registration = await Registration.findOne({ userId });
  if (!registration) return res.status(404).json({ message: "Registration not found" });

  const status = await AbstractStatus.findOne({ userId });
  if (!status || status.paperStatus !== "Correction Required")
    return res
      .status(400)
      .json({ message: "No correction required or already submitted." });

  if (!req.file)
    return res.status(400).json({ message: "No correction file uploaded." });

  const correctionUrl = saveFileLocally(correctionDir, req.file, `correction_${userId}`);

  await AbstractStatus.findOneAndUpdate(
    { userId },
    { correctionPaperUrl: correctionUrl, paperStatus: "Under Review" },
    { new: true }
  );

  await User.findByIdAndUpdate(userId, { paperStatus: "Under Review" });

  res.json({
    message: "Correction paper uploaded successfully. Awaiting review.",
    correctionUrl,
  });
});
