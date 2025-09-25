import asyncHandler from "express-async-handler";
import Registration from "../models/registerModel.js";
import AbstractStatus from "../models/abstractStatusModel.js";
import { createPhonePeOrder, verifyPhonePePayment } from "../config/phonepe.js";
import User from "../models/userModel.js";

// ----------------------------
// Create Payment Order
// ----------------------------
export const initiatePayment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const registration = await Registration.findOne({ userId });
  if (!registration) return res.status(404).json({ message: "Registration not found" });

  const firstParticipant = registration.participants[0];
  let amount = 0;

  // Payment logic based on designation
  if (firstParticipant.designation === "Student") amount = 1000;
  else if (firstParticipant.designation === "Researcher") amount = 2000;
  else if (firstParticipant.designation === "Faculty") amount = 3000;
  else if (firstParticipant.designation === "Industry") amount = 5000;

  // Apply discount if approved
  const status = await AbstractStatus.findOne({ userId });
  if (status.discount && firstParticipant.designation === "Student") amount = 700;

  // Create order ID
  const orderId = `ORDER_${userId}_${Date.now()}`;

  const order = await createPhonePeOrder({ amount, orderId, user: req.user });

  res.json({
    message: "Payment order created",
    order,
    orderId,
    amount,
    currency: "INR",
  });
});

// ----------------------------
// Verify Payment
// ----------------------------
export const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentId, orderId } = req.body;
  const paymentStatus = await verifyPhonePePayment({ paymentId });

  if (paymentStatus.success) {
    const registration = await Registration.findOne({ userId: req.user.id });
    registration.paymentStatus = "paid";
    registration.paymentDate = new Date();
    registration.transactionId = paymentId;
    registration.amountPaid = paymentStatus.amount / 100;
    registration.currency = "INR";
    await registration.save();

    const status = await AbstractStatus.findOne({ userId: req.user.id });
    status.paymentStatus = "paid";
    await status.save();

    return res.json({ message: "Payment successful", registration });
  }

  res.status(400).json({ message: "Payment verification failed", paymentStatus });
});
