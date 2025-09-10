
// // import mongoose from "mongoose";

// // // This schema defines an individual participant. It's a sub-document.
// // const participantSchema = new mongoose.Schema({
// //   name: { 
// //     type: String, 
// //     required: [true, "Participant name is required."] 
// //   },
// //   designation: { 
// //     type: String, 
// //     required: [true, "Participant designation is required."] 
// //   },
// //   organisation: { 
// //     type: String, 
// //     required: [true, "Participant organisation is required."] 
// //   },
// //   email: { 
// //     type: String, 
// //     required: [true, "Participant email is required."] 
// //   },
// //   phone: { 
// //     type: String, 
// //     required: [true, "Participant phone number is required."] 
// //   },
// // }, { _id: false }); // Prevents Mongoose from creating a separate _id for each participant.

// // // This is the main registration schema that matches your React form.
// // const registerSchema = new mongoose.Schema({
// //   // It's good practice to link the entire registration to a single user account.
// //   userId: { 
// //     type: mongoose.Schema.Types.ObjectId, 
// //     ref: "User", 
// //     required: true,
// //     unique: true // Ensures one registration per user account.
// //   },
// //    uniqueId: {
// //     type: String, // just a string, not ObjectId
// //     required: true,
// //     unique: true,
// //   },
// //   // This defines the array of participants using the schema above.
// //   participants: {
// //     type: [participantSchema],
// //     // validate: {
// //     //   validator: (arr) => arr.length >= 1 && arr.length <= 4,
// //     //   message: "You must provide between 1 and 4 participants."
// //     // },
// //     required: true
// //   },

// //   // Contact Information fields from the form.
// //   address: { 
// //     type: String, 
// //     required: [true, "Mailing address is required."] 
// //   },
// //   country: { 
// //     type: String, 
// //     required: [true, "Country is required."] 
// //   },
// //   pincode: { 
// //     type: String, 
// //     required: [true, "Pincode is required."] 
// //   },

// //   // Abstract Submission fields from the form.
// //   track: { 
// //     type: String, 
// //     required: [true, "Conference track selection is required."] 
// //   },
// //   abstractTitle: { 
// //     type: String, 
// //     required: [true, "Abstract title is required."] 
// //   },
// //   abstractContent: { 
// //     type: String, 
// //     required: [true, "Abstract content is required."] 
// //   },
// //   abstractExpression: { 
// //     type: String, 
// //     required: [true, "Keywords are required."] 
// //   },
  
// // }, { timestamps: true }); // Automatically adds createdAt and updatedAt fields.

// // export default mongoose.model("Registration", registerSchema);


// import mongoose from "mongoose";

// // ----------------------------
// // Participant Sub-schema
// // ----------------------------
// const participantSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Participant name is required."],
//     },
//     designation: {
//       type: String,
//       required: [true, "Participant designation is required."],
//     },
//     organisation: {
//       type: String,
//       required: [true, "Participant organisation is required."],
//     },
//     email: {
//       type: String,
//       required: [true, "Participant email is required."],
//     },
//     phone: {
//       type: String,
//       required: [true, "Participant phone number is required."],
//     },
//   },
//   { _id: false }
// );

// // ----------------------------
// // Main Registration Schema
// // ----------------------------
// const registerSchema = new mongoose.Schema(
//   {
//     // User reference
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       unique: true,
//     },

//     uniqueId: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     // Participants
//     participants: {
//       type: [participantSchema],
//       required: true,
//     },

//     // Contact Info
//     address: {
//       type: String,
//       required: [true, "Mailing address is required."],
//     },
//     country: {
//       type: String,
//       required: [true, "Country is required."],
//     },
//     pincode: {
//       type: String,
//       required: [true, "Pincode is required."],
//     },

//     // Abstract Submission
//     track: {
//       type: String,
//       required: [true, "Conference track selection is required."],
//     },
//     abstractTitle: {
//       type: String,
//       required: [true, "Abstract title is required."],
//     },
//     abstractContent: {
//       type: String,
//       required: [true, "Abstract content is required."],
//     },
//     abstractExpression: {
//       type: String,
//       required: [true, "Keywords are required."],
//     },

//     // ----------------------------
//     // Final Paper
//     // ----------------------------
//     paperUrl: {
//       type: String, // Cloudinary file link
//     },
//     finalPaperTitle: {
//       type: String,
//     },
//     finalPaperContent: {
//       type: String,
//     },
//     finalPaperTrack: {
//       type: String,
//     },

//     // ----------------------------
//     // Payment Details
//     // ----------------------------
//     // paymentStatus: {
//     //   type: String,
//     //   enum: ["pending", "success", "failed"],
//     //   default: "pending",
//     // },
// paymentStatus: {
//   type: String,
//   enum: ["unpaid", "paid"],   // ✅ only unpaid/paid
//   default: "unpaid",
// },

//     paymentDate: {
//       type: Date,
//     },
//     paymentMethod: {
//       type: String, // e.g., "Razorpay", "Stripe", "Bank Transfer"
//     },
//     transactionId: {
//       type: String, // from gateway
//     },
//     amountPaid: {
//       type: Number,
//     },
//     currency: {
//       type: String,
//       default: "INR",
//     },
//     invoiceUrl: {
//       type: String, // optional: store invoice PDF/URL
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Registration", registerSchema);


import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  organisation: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
}, { _id: false });

const registerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  uniqueId: { type: String, required: true, unique: true },
  participants: { type: [participantSchema], required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
  track: { type: String, required: true },
  abstractTitle: { type: String, required: true },
  abstractContent: { type: String, required: true },
  abstractExpression: { type: String, required: true },

  // Final Paper
  paperUrl: { type: String },
  finalPaperTitle: { type: String },
  finalPaperContent: { type: String },
  finalPaperTrack: { type: String },

  // Payment
  paymentStatus: { type: String, enum: ["unpaid","paid"], default: "unpaid" },
  paymentDate: { type: Date },
  paymentMethod: { type: String },
  transactionId: { type: String },
  amountPaid: { type: Number },
  currency: { type: String, default: "INR" },
  invoiceUrl: { type: String },
}, { timestamps: true });

export default mongoose.model("Registration", registerSchema);
