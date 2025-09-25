import mongoose from "mongoose";

const abstractStatusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    abstractStatus: {
      type: String,
      enum: ["No Abstract", "submitted", "Approved", "Rejected"],
      default: "No Abstract",
    },

    paperStatus: {
      type: String,
      enum: ["No Paper", "submitted"],
      default: "No Paper",
    },

    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },

    abstractApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // 👈 better to reference Admin instead of User
      default: null,
    },

    rejectedReason: { type: String, default: null },

    discount: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("AbstractStatus", abstractStatusSchema);
