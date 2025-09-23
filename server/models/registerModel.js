import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  organisation: { type: String, required: true },
  email: { type: String, required: true },
  proofUrl: { type: String },
  phone: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true } 
}, { _id: false });

// models/registerModel.js
const registerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  uniqueId: { type: String, required: true, unique: true },
  participants: { type: [participantSchema], required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
  track: { type: String, required: true },
  presentationMode: { type: String, enum: ["Online", "Offline"], required: true },

  // Abstract Submission
  abstractTitle: { type: String, required: true },
  abstractContent: { type: String, required: true },
  abstractExpression: { type: String, required: true },

  // Final Paper
  paperUrl: { type: String },
  finalPaperTitle: { type: String },
  finalPaperContent: { type: String },
  finalPaperTrack: { type: String },

  // Payment
  paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  paymentDate: { type: Date },
  paymentMethod: { type: String },
  transactionId: { type: String },
  amountPaid: { type: Number,default:0 },
  currency: { type: String, default: "INR" },
  invoiceUrl: { type: String },
}, { timestamps: true });


export default mongoose.model("Registration", registerSchema);