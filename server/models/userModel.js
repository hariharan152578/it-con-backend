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
  mobileno: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  role: { type: String, default: "user" },
  userId: { type: String, unique: true, default: generateUserId },
  abstractStatus: { type: String, enum: ["No Abstract","under review", "approved", "rejected"], default: "No Abstract" },
  paperStatus: { type: String, enum: ["No Paper","submitted"], default: "No Paper" },
  paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
}, { timestamps: true });

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
