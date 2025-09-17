import mongoose from "mongoose";

const abstractStatusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

  abstractStatus: { type: String, enum: ["No Data","Submitted","approved","rejected"], default: "No Data" },
  abstractApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  rejectedReason:{type:String,default:null},
  discount:{type:Boolean,default:false},
  abstractreasonBy:{type:mongoose.Schema.Types.ObjectId,ref:"Admin",default:null},
  paperStatus: { type: String, enum: ["No Data","submitted"], default: "No Data" },
  paperApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },

  paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  paymentApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  paymentMethod: { type: String, default: "PayPal" }, // fixed since gateway = PayPal
  transactionId: { type: String,default:null }, // PayPal order/transaction ID
  amountPaid: { type: Number,default:0 },
  currency: { type: String, default: "INR" }, // PayPal default is USD, can override
  paymentDate: { type: Date,default:null }
}, { timestamps: true });

export default mongoose.model("AbstractStatus", abstractStatusSchema);
