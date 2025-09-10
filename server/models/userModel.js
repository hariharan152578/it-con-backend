// // import mongoose from "mongoose";
// // import bcrypt from "bcryptjs";

// // function generateUserId() {
// //   const randomNum = Math.floor(1000 + Math.random() * 9000);
// //   return `IC${randomNum}`;
// // }

// // // const userSchema = new mongoose.Schema(
// // //   {
// // //     userId: {
// // //       type: String,
// // //       unique: true,
// // //       default: generateUserId,
// // //     },
// // //     name: {
// // //       type: String,
// // //       required: [true, "Name is required"],
// // //     },
// // //     email: {
// // //       type: String,
// // //       required: [true, "Email is required"],
// // //       unique: true,
// // //       lowercase: true,
// // //     },
// // //     password: {
// // //       type: String,
// // //       required: [true, "Password is required"],
// // //       minlength: 6,
// // //     },
// // //   },
// // //   { timestamps: true }
// // // );

// // // hash password

// // const userSchema = mongoose.Schema(
// //   {
// //     name: { type: String, required: true },
// //     email: { type: String, required: true, unique: true },
// //     password: { type: String, required: true },
// //     userId: { type: String, unique: true },
// //     abstractStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
// //     finalPaperStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
// //     paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
// //   },
// //   { timestamps: true }
// // );

// // userSchema.pre("save", async function (next) {
// //   if (!this.isModified("password")) return next();
// //   const salt = await bcrypt.genSalt(10);
// //   this.password = await bcrypt.hash(this.password, salt);
// //   next();
// // });

// // // compare password
// // userSchema.methods.matchPassword = async function (enteredPassword) {
// //   return await bcrypt.compare(enteredPassword, this.password);
// // };

// // export default mongoose.model("User", userSchema);

// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// // Function to generate unique userId
// function generateUserId() {
//   const randomNum = Math.floor(1000 + Math.random() * 9000);
//   return `IC${randomNum}`;
// }

// const userSchema = mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     userId: { type: String, unique: true, default: generateUserId }, // auto-generate
//     abstractStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//     finalPaperStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//     paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
//   },
//   { timestamps: true }
// );

// // Hash password before save
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Compare password for login
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// export default mongoose.model("User", userSchema);


import mongoose from "mongoose";
import bcrypt from "bcryptjs";

function generateUserId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `IC${randomNum}`;
}

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userId: { type: String, unique: true, default: generateUserId },
  abstractStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  finalPaperStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
