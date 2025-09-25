import mongoose from "mongoose";

// ----------------------------
// Participant Sub-schema
// ----------------------------
const participantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    organisation: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    // Optional proof file (Cloudinary URL)
    proofUrl: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true }
  },
  { _id: false } // Prevent _id for sub-documents
);

//paymentSchema
const paymentSchema=new mongoose.Schema({
     // Payment (PayPal support)
    paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    paymentMethod: { type: String, default: "PayPal" }, // fixed since gateway = PayPal
    transactionId: { type: String }, // PayPal order/transaction ID
    amountPaid: { type: Number },
    currency: { type: String, default: "USD" }, // PayPal default is USD, can override
    paymentDate: { type: Date },
    
}
)
// ----------------------------
// Main Registration Schema
// ----------------------------
const registerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    uniqueId: { type: String, required: true, unique: true },

    participants: { type: [participantSchema], required: true },

    // Contact info
    address: { type: String, required: true },
    country: { type: String, required: true },
    pincode:{type:String,required:true},

    // Conference info
    track: { type: String, required: true },
    presentationMode: { type: String, enum: ["Online", "Offline"], required: true },

    // Abstract submission
    abstractTitle: { type: String, required: true },
    abstractContent: { type: String, required: true },
    abstractExpression: { type: String, required: true },


     // Final Paper (optional, uploaded later)
    paperUrl: { type: String,required:true },

      // 👇 embedded payment
    payment: paymentSchema,
  },
  { timestamps: true } // createdAt & updatedAt
);

export default mongoose.model("Registration", registerSchema);
