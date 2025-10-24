
// );
import mongoose from "mongoose";

const abstractStatusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ABSTRACT STATUS FLOW
    abstractStatus: {
      type: String,
      enum: ["No Abstract", "Submitted", "Approved", "Rejected"],
      default: "No Abstract",
    },

    // PAPER STATUS FLOW
    paperStatus: {
      type: String,
      enum: [
        "No Paper",
        "Submitted",
        "Under Review",
        "Correction Required",
        "Approved",
        "Rejected",
      ],
      default: "No Paper",
    },

    // TRACKERS
    abstractApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    paperReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    paperReviewDate: { type: Date, default: null },

    // CORRECTION DETAILS
    correctedPaperUrl: { type: String, default: null },
    correctionsRequested: { type: Number, default: 0 },
    correctionsUploaded: { type: Number, default: 0 },

    // REJECTION REASONS
    abstractrejectedReason: { type: String, default: null },
    paperrejectedReason: { type: String, default: null },

    // PAYMENT
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },

    // DISCOUNT FLAG
    discount: { type: Boolean, default: false },
    earlyBirdDiscount: { type: Boolean, default: false},
  },
  { timestamps: true }
);

export default mongoose.model("AbstractStatus", abstractStatusSchema);

