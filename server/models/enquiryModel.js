import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  proofs: [{ type: String, default: null }], // store multiple proof URLs per message
  status: {
    type: String,
    enum: ["unresolved", "resolved"],
    default: "unresolved",
  },
  createdAt: { type: Date, default: Date.now },
});

const enquirySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },

    // 📝 Store multiple messages with their own proofs
    messages: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
