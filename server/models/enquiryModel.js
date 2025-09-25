// import mongoose from "mongoose";

// const enquirySchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, required: true },
//     mobile: { type: String, required: true },

//     // 📝 Multiple messages allowed
//     messages: [
//       {
//         text: { type: String, required: true },
//         createdAt: { type: Date, default: Date.now },
//       },
//     ],

//     // ✅ Proof file (uploaded by user, stored as URL/path)
//     proof: { type: String, default: null },

//     // ✅ Admin-controlled status
//     status: {
//       type: String,
//       enum: ["unresolved", "resolved"],
//       default: "unresolved",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Enquiry", enquirySchema);


import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },

    // 📝 Store multiple messages from same user
    messages: [
      {
        text: { type: String, required: true },
        status: {
      type: String,
      enum: ["unresolved", "resolved"],
      default: "unresolved",
    },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // ✅ New fields
    
    proof: { type: String, default: null }, // file path, URL, or admin note
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
