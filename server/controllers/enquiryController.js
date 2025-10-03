// import asyncHandler from "express-async-handler";
// import Enquiry from "../models/enquiryModel.js";
// import cloudinary from "../config/cloudinary.js"; // assuming you already have this

// // 📌 Create / Append Enquiry (User)
// export const createEnquiry = asyncHandler(async (req, res) => {
//   const { firstName, lastName, email, mobile, message } = req.body;
//   const userId = req.user?.id;

//   if (!firstName || !lastName || !email || !mobile || !message) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   let proofUrl = null;

//   // ✅ Handle proof file upload if provided
  // if (req.file) {
  //   const uploadResult = await new Promise((resolve, reject) => {
  //     const stream = cloudinary.uploader.upload_stream(
  //       { resource_type: "auto", folder: "enquiry-proofs" },
  //       (error, result) => {
  //         if (error) reject(new Error("Cloudinary upload failed"));
  //         else resolve(result.secure_url);
  //       }
  //     );
  //     stream.end(req.file.buffer);
  //   });

  //   proofUrl = uploadResult;
  // }

//   let enquiry = await Enquiry.findOne({ userId });

//   if (enquiry) {
//     enquiry.messages.push({ text: message });
//     if (proofUrl) enquiry.proof = proofUrl; // overwrite with latest proof
//     await enquiry.save();
//   } else {
//     enquiry = await Enquiry.create({
//       userId,
//       firstName,
//       lastName,
//       email,
//       mobile,
//       messages: [{ text: message }],
//       proof: proofUrl,
//     });
//   }

//   res.status(201).json({
//     message: "Enquiry submitted successfully",
//     enquiry,
//   });
// });

// // 📌 Admin: Get all enquiries
// export const getAllEnquiries = asyncHandler(async (req, res) => {
//   const enquiries = await Enquiry.find()
//     .populate("userId", "name email")
//     .sort({ createdAt: -1 });

//   res.json({
//     total: enquiries.length,
//     enquiries,
//   });
// });

// // 📌 Admin: Update status of a specific enquiry message
// export const updateEnquiryStatus = asyncHandler(async (req, res) => {
//   const { id } = req.params; // Enquiry ID
//   const { messageId, status } = req.body; // Which message to update

//   if (!["resolved", "unresolved"].includes(status)) {
//     return res.status(400).json({ message: "Invalid status value" });
//   }

//   // 🔎 Find enquiry
//   const enquiry = await Enquiry.findById(id);
//   if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

//   // 🔎 Find the message inside messages[]
//   const message = enquiry.messages.id(messageId);
//   if (!message) return res.status(404).json({ message: "Message not found" });

//   // ✅ Update status for this message only
//   message.status = status;
//   await enquiry.save();

//   res.json({
//     message: "Message status updated successfully",
//     enquiry,
//   });
// });



import asyncHandler from "express-async-handler";
import Enquiry from "../models/enquiryModel.js";
import cloudinary from "../config/cloudinary.js"; // make sure this is configured

// 📌 Create / Append Enquiry (User)
export const createEnquiry = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, mobile, message } = req.body;
  const userId = req.user?.id;

  if (!firstName || !lastName || !email || !mobile || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let proofUrl = null;

  // ✅ Handle proof file upload if provided
  if (req.file) {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "enquiry-proofs" },
        (error, result) => {
          if (error) reject(new Error("Cloudinary upload failed"));
          else resolve(result.secure_url);
        }
      );
      stream.end(req.file.buffer);
    });

    proofUrl = uploadResult;
  }

  let enquiry = await Enquiry.findOne({ userId });

  const newMessage = { text: message, proofs: proofUrl };

  if (enquiry) {
    enquiry.messages.push(newMessage);
    await enquiry.save();
  } else {
    enquiry = await Enquiry.create({
      userId,
      firstName,
      lastName,
      email,
      mobile,
      messages: [newMessage],
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

// 📌 Admin: Update status of a specific enquiry message
export const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params; // Enquiry ID
  const { messageId, status } = req.body; // Which message to update

  if (!["resolved", "unresolved"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const enquiry = await Enquiry.findById(id);
  if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

  const message = enquiry.messages.id(messageId);
  if (!message) return res.status(404).json({ message: "Message not found" });

  message.status = status;
  await enquiry.save();

  res.json({
    message: "Message status updated successfully",
    enquiry,
  });
});
