import mongoose from "mongoose";

// Participant sub-schema
const participantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    organisation: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    proofUrl: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  },
  { _id: false }
);

// Payment sub-schema (Razorpay only)
const paymentSchema = new mongoose.Schema(
  {
    paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    orderId: { type: String }, // razorpay paymentIntent id
    paymentId: { type: String }, // razorpay charge id
    paymentMethod: { type: String, default: "razorpay" },
    amountPaid: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    convertedAmount:{type:Number,default:0},
    country:{type:String,default:"India"},
    paymentDate: { type: Date },
  },
  { _id: false }
);

const registerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    uniqueId: { type: String, required: true, unique: true },
    participants: { type: [participantSchema], required: true },
    address: { type: String, required: true },
    // country: { type: String, required: true },
    pincode: { type: String, required: true },
    track: { type: String, required: true },
    presentationMode: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },
    abstractTitle: { type: String, required: true },
    abstractContent: { type: String, required: true },
    abstractExpression: { type: String, required: true },
    paperUrl: { type: String },
    accommodation: { type: Boolean,default:"false" },
    payment: { type: paymentSchema, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("Registration", registerSchema);
