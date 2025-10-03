import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import QRCode from "qrcode";
import Registration from "../models/registerModel.js";
import User from "../models/userModel.js";
import { sendEmail } from "../config/email.js";
import AbstractStatus from "../models/abstractStatusModel.js";
import { emailTemplate } from "../config/emailTemplate.js";
import PDFDocument from "pdfkit";
// Create Order (dynamic)
export const createOrder = asyncHandler(async (req, res) => {
  const { userId, amount, currency } = req.query;

  if (!userId || !amount || !currency) {
    return res.status(400).json({ message: "Missing userId, amount, or currency" });
  }

  const registration = await Registration.findOne({ userId });
  if (!registration) return res.status(404).json({ message: "Registration not found" });

  const transactionId = `TXN_${userId}_${Date.now()}`;

  // Save transaction info
  registration.payment.transactionId = transactionId;
  registration.payment.amountPaid = Number(amount);
  registration.payment.currency = currency;
  registration.payment.paymentStatus = "unpaid";
  await registration.save();

  res.json({
    success: true,
    message: "Order created successfully",
    transactionId,
    amount,
    currency,
    redirectUrl: `/api/payments/complete-payment?userId=${userId}&transactionId=${transactionId}`,
  });
});

// Complete Payment
export const completePayment = asyncHandler(async (req, res) => {
  const { userId, transactionId } = req.query;

  if (!userId || !transactionId) {
    return res.status(400).json({ message: "Missing userId or transactionId" });
  }

  // ✅ Find registration
  const registration = await Registration.findOne({
    userId,
    "payment.transactionId": transactionId,
  });
  if (!registration) {
    return res.status(404).json({ message: "Registration not found" });
  }

  // ✅ Mark as paid
  registration.payment.paymentStatus = "paid";
  registration.payment.paymentDate = new Date();
  await registration.save();

  // ✅ Update User collection
  await User.findByIdAndUpdate(
    userId,
    {
      paymentStatus: "Paid",
      paperStatus: registration.finalPaperStatus || "No Paper",
    },
    { new: true }
  );

  // ✅ Update AbstractStatus collection
  await AbstractStatus.findOneAndUpdate(
    { userId },
    {
      abstractStatus: registration.abstractStatus || "Submitted",
      finalPaperStatus: registration.finalPaperStatus || "Pending",
      paymentStatus: "Paid",
      rejectedReason: null,
    },
    { new: true, upsert: true }
  );

  const user = await User.findById(userId);

  // ✅ Generate hall ticket token
  const hallTicketToken = jwt.sign(
    {
      userId,
      uniqueId: registration.uniqueId,
      name: registration.participants[0]?.name,
      email: registration.participants[0]?.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "7d" }
  );

  const hallTicketUrl = `${process.env.CLIENT_ORIGIN}/api/pdf/download-hall-ticket/${hallTicketToken}`;

  // ✅ Generate QR code for hall ticket
  const qrCodeUrl = await QRCode.toDataURL(hallTicketUrl);

  // ✅ Send confirmation email with QR code
  if (user?.email) {
    const htmlContent = emailTemplate(
      "Payment Successful 🎉",
      "Your payment was successful. Download your hall ticket below:",
      registration.participants[0]?.name,
      registration.participants[0]?.email,
      userId,
      registration.abstractTitle,
      registration.finalPaperStatus,
      "Paid",
      {
        uniqueId: registration.uniqueId,
        hallTicketUrl,
        qrCodeUrl, // 🚀 Make sure this gets passed
      }
    );

    try {
      await sendEmail({
        to: user.email,
        subject: "Conference Payment Successful",
        text: `Download your hall ticket here: ${hallTicketUrl}`,
        html: htmlContent,
      });
      console.log("✅ Payment confirmation email sent to:", user.email);
    } catch (err) {
      console.error("❌ Email sending failed:", err.message);
    }
  }

  res.json({
    message: "Payment completed successfully. Hall ticket email sent.",
    hallTicketUrl,
    qrCodeUrl,
  });
});

// /**
//  * Download PDF Hall Ticket
export const downloadHallTicket = asyncHandler(async (req, res) => {
  const { token } = req.params;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Disposition", "attachment; filename=hall_ticket.pdf");
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    // Header
    doc.fontSize(22).fillColor("#1e3a8a").text("🎟 Conference Hall Ticket", {
      align: "center",
    });
    doc.moveDown();

    // User Info
    doc.fontSize(14).fillColor("black");
    doc.text(`Unique ID: ${payload.uniqueId}`);
    doc.text(`Name: ${payload.name}`);
    doc.text(`Organization: ${payload.organization}`);
    doc.text(`Email: ${payload.email}`);
    doc.text(`Abstract Title: ${payload.abstractTitle}`);
    doc.text(`Mode: ${payload.mode}`);
    doc.text(`Track: ${payload.track}`);
    doc.moveDown();

    // Status
    doc.fontSize(14).text("📌 Statuses:");
    doc.text(`- Payment Status: ${payload.paymentStatus}`);
    doc.text(`- Abstract Status: ${payload.abstractStatus}`);
    doc.text(`- Final Paper Status: ${payload.finalPaperStatus}`);
    doc.text(`- Accommodation: ${payload.accommodation}`);
    doc.moveDown();

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).fillColor("gray").text(
      "© Conference Portal | Contact: ksritconference@gmail.com",
      { align: "center" }
    );

    doc.end();
  } catch (err) {
    console.error("❌ Invalid or expired hall ticket token:", err.message);
    res.status(400).json({ message: "Invalid or expired hall ticket link" });
  }
});

