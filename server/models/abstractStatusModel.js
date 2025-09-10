// import mongoose from "mongoose";

// const abstractStatusSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       unique: true,
//     },

//     // Step 1: Abstract workflow
//     abstractStatus: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     },
//     abstractApprovedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Admin",
//       default: null,
//     },

//     // Step 2: Final Paper workflow
//     finalPaperStatus: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     },
//     paperApprovedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Admin",
//       default: null,
//     },

//     // Step 3: Payment workflow
//     paymentStatus: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     },
//     paymentApprovedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Admin",
//       default: null,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("AbstractStatus", abstractStatusSchema);


import mongoose from "mongoose";

const abstractStatusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

  abstractStatus: { type: String, enum: ["pending","approved","rejected"], default: "pending" },
  abstractApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },

  finalPaperStatus: { type: String, enum: ["pending","approved","rejected"], default: "pending" },
  paperApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },

  paymentStatus: { type: String, enum: ["pending","approved","rejected"], default: "pending" },
  paymentApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
}, { timestamps: true });

export default mongoose.model("AbstractStatus", abstractStatusSchema);
