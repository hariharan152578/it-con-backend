import asyncHandler from "express-async-handler";
import Enquiry from "../models/enquiryModel.js";

// 📌 Create / Append Enquiry
export const createEnquiry = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, mobile, message } = req.body;
  const userId = req.user?.id; // ✅ from token middleware

  if (!firstName || !lastName || !email || !mobile || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let enquiry = await Enquiry.findOne({ userId });

  if (enquiry) {
    // 🔄 Append new message without overriding
    enquiry.messages.push({ text: message });
    await enquiry.save();
  } else {
    // 🆕 Create new enquiry for first-time user
    enquiry = await Enquiry.create({
      userId,
      firstName,
      lastName,
      email,
      mobile,
      messages: [{ text: message }],
    });
  }

  res.status(201).json({
    message: "Enquiry submitted successfully",
    enquiry,
  });
});


// 📌 Admin: Get all enquiries
export const getAllEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  res.json({
    total: enquiries.length,
    enquiries,
  });
});