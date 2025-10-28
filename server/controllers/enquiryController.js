// import asyncHandler from "express-async-handler";
// import Enquiry from "../models/enquiryModel.js";
// import { saveFileLocally } from "../config/filehelper.js"; // ✅ Global helper import

// // -----------------------------
// // Create / Append Enquiry (User)
// // -----------------------------
// export const createEnquiry = asyncHandler(async (req, res) => {
//   try {
//     const { firstName, lastName, email, mobile, message } = req.body;
//     const userId = req.user?.id;

//     if (!firstName || !lastName || !email || !mobile || !message) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     let proofUrl = null;

//     // ✅ Handle file upload if proof is provided
//     if (req.file) {
//       try {
//         // saveFileLocally(folder, file, fileName)
//         proofUrl = saveFileLocally("proofs", req.file, `proof_${userId}`);
//       } catch (error) {
//         console.error("❌ Local File Save Error:", error);
//         return res
//           .status(500)
//           .json({ message: "Failed to save proof file locally" });
//       }
//     }

//     // ✅ Create or update existing enquiry
//     let enquiry = await Enquiry.findOne({ userId });
//     const newMessage = { text: message, proofs: proofUrl };

//     if (enquiry) {
//       enquiry.messages.push(newMessage);
//       await enquiry.save();
//     } else {
//       enquiry = await Enquiry.create({
//         userId,
//         firstName,
//         lastName,
//         email,
//         mobile,
//         messages: [newMessage],
//       });
//     }

//     res.status(201).json({
//       message: "Enquiry submitted successfully",
//       enquiry,
//     });
//   } catch (error) {
//     console.error("❌ Create Enquiry Error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to create enquiry", error: error.message });
//   }
// });

// // -----------------------------
// // Admin: Get all enquiries
// // -----------------------------
// export const getAllEnquiries = asyncHandler(async (req, res) => {
//   try {
//     const enquiries = await Enquiry.find()
//       .populate("userId", "name email")
//       .sort({ createdAt: -1 });

//     res.json({
//       total: enquiries.length,
//       enquiries,
//     });
//   } catch (error) {
//     console.error("❌ Get All Enquiries Error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch enquiries", error: error.message });
//   }
// });

// // -----------------------------
// // Admin: Update status of a specific enquiry message
// // -----------------------------
// export const updateEnquiryStatus = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params; // Enquiry ID
//     const { messageId, status } = req.body; // Which message to update

//     if (!["resolved", "unresolved"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }

//     const enquiry = await Enquiry.findById(id);
//     if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

//     const message = enquiry.messages.id(messageId);
//     if (!message) return res.status(404).json({ message: "Message not found" });

//     message.status = status;
//     await enquiry.save();

//     res.json({
//       message: "Message status updated successfully",
//       enquiry,
//     });
//   } catch (error) {
//     console.error("❌ Update Enquiry Status Error:", error);
//     res
//       .status(500)
//       .json({
//         message: "Failed to update message status",
//         error: error.message,
//       });
//   }
// });


import asyncHandler from "express-async-handler";
import Enquiry from "../models/enquiryModel.js";
import { saveFileLocally } from "../config/filehelper.js";

// ===================================================
// 🧾 Create or Append Enquiry (User)
// ===================================================
export const createEnquiry = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, mobile, message } = req.body;
  const userId = req.user?.id;

  if (!firstName || !lastName || !email || !mobile || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // ✅ Handle optional proof file
    const proofUrl = req.file
      ? saveFileLocally("proofs", req.file, `proof_${userId}`)
      : null;

    // ✅ Prepare new message object
    const newMessage = {
      text: message,
      proofs: proofUrl,
      createdAt: new Date(),
    };

    // ✅ Use atomic update to append message or create new enquiry
    const enquiry = await Enquiry.findOneAndUpdate(
      { userId },
      {
        $setOnInsert: { firstName, lastName, email, mobile, userId },
        $push: { messages: newMessage },
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      enquiry,
    });
  } catch (error) {
    console.error("❌ Create Enquiry Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry",
      error: error.message,
    });
  }
});

// ===================================================
// 👨‍💼 Get All Enquiries (Admin)
// ===================================================
export const getAllEnquiries = asyncHandler(async (req, res) => {
  try {
    const [enquiries, total] = await Promise.all([
      Enquiry.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 }),
      Enquiry.countDocuments(),
    ]);

    res.json({ success: true, total, enquiries });
  } catch (error) {
    console.error("❌ Get All Enquiries Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
      error: error.message,
    });
  }
});

// ===================================================
// 🛠️ Update Status of Specific Enquiry Message (Admin)
// ===================================================
export const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params; // Enquiry document ID
  const { messageId, status } = req.body;

  if (!["resolved", "unresolved"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    // ✅ Use positional update to directly modify nested message
    const enquiry = await Enquiry.findOneAndUpdate(
      { _id: id, "messages._id": messageId },
      { $set: { "messages.$.status": status } },
      { new: true }
    ).populate("userId", "name email");

    if (!enquiry)
      return res.status(404).json({ message: "Enquiry or message not found" });

    res.json({
      success: true,
      message: "Message status updated successfully",
      enquiry,
    });
  } catch (error) {
    console.error("❌ Update Enquiry Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update message status",
      error: error.message,
    });
  }
});
