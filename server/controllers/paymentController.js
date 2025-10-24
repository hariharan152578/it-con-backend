


// controllers/paymentController.js
import crypto from "crypto";
import { razorpay, countryCodes,inrToCurrency } from "../config/payment.js";
import Registration from "../models/registerModel.js";
import User from "../models/userModel.js";
import AbstractStatus from "../models/abstractStatusModel.js";
import {sendEmail} from "../config/email.js";
import emailTemplate from "../config/emailTemplate.js";


export const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Fetch registration
    const registration = await Registration.findOne({ userId });
    if (!registration)
      return res.status(404).json({ message: "Registration not found" });
   const userstatus= await User.findById(userId);
  //  console.log(userstatus);
   
   
   if(userstatus.paperStatus!=="Approved"){
    return res.status(400).json({ message: "Paper not Approved by admin" });
   }
    // ✅ Base amount in INR
    const amountInINR = registration.payment?.amountPaid;
    if (!amountInINR || amountInINR <= 0)
      return res
        .status(400)
        .json({ message: "Amount not set. Please wait for admin approval." });

    // ✅ User info
    const user = await User.findById(userId);
    const mobileCode = user?.mobilenocountrycode || "+91";
    const currency = countryCodes[mobileCode] || "INR";

    // ✅ Convert amount to user currency & smallest unit
    const convertedAmount =
      currency === "INR"
        ? Math.round(amountInINR * 100) // paise
        : Math.round(amountInINR * inrToCurrency[mobileCode] * 100); // cents
    
    console.log(
      `💰 Base INR: ${amountInINR} → Converted: ${convertedAmount / 100} ${currency}`
    );

    // ✅ Create a short receipt (≤40 chars)
    const shortReceipt = `ord_${userId.slice(-10)}_${Date.now()
      .toString()
      .slice(-5)}`;

    // ✅ Create Razorpay order
    const order = await razorpay.orders.create({
      amount: convertedAmount,
      currency,
      receipt: shortReceipt,
      notes: { userId, registrationId: registration._id.toString() },
    });

    // ✅ Save orderId in registration
    registration.payment.orderId = order.id;
    registration.payment.currency = currency;
    registration.payment.convertedAmount=convertedAmount/100;
    registration.payment.amountPaid = amountInINR; // store in currency unit
    await registration.save();

    res.json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: registration.payment.amountPaid,
      convertedAmount:registration.payment.convertedAmount/100,
      currency,
      name: user.name,
      email: user.email,
      contact: user.mobileno,
    });
  } catch (err) {
    console.error("Razorpay Order Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // ✅ Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment verification fields" });
    }

    // 🔒 Verify signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("❌ Invalid Razorpay Signature");
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // 🔍 Find registration linked to this order
    const registration = await Registration.findOne({ "payment.orderId": razorpay_order_id });
    if (!registration) return res.status(404).json({ success: false, message: "Registration not found for this order" });

    // ✅ Fetch user
    const user = await User.findById(registration.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // ✅ Fetch or create AbstractStatus
    let abstractStatus = await AbstractStatus.findOne({ userId: registration.userId });
    if (!abstractStatus) {
      abstractStatus = new AbstractStatus({
        userId: registration.userId,
        paymentStatus: "paid"
      });
    } else if (abstractStatus.paymentStatus === "paid") {
      return res.status(400).json({ success: false, message: "Payment already completed" });
    } else {
      abstractStatus.paymentStatus = "paid";
    }
    await abstractStatus.save();

    // ✅ Update registration payment info
    registration.payment.paymentStatus = "paid";
    registration.payment.paymentId = razorpay_payment_id;
    registration.payment.paymentDate = new Date();
    await registration.save();

    // ✅ Update user payment status
    user.paymentStatus = "paid";
    await user.save();
if(user.email){
    // ✅ Send payment confirmation email
    const subject = "💳 Payment Successful";
    const message = `
      Dear ${user.name},<br/><br/>
      We’ve successfully received your payment for the <b>KSR IT Conference</b>.<br/><br/>
      <b>Transaction ID:</b> ${razorpay_payment_id}<br/>
      <b>Amount:</b> ${registration.payment.amountPaid} ${registration.payment.currency}<br/>
      <b>Date:</b> ${new Date(registration.payment.paymentDate).toLocaleString()}<br/><br/>
      Thank you for your registration! 🎉<br/>
      You can now download your hall ticket once it becomes available.
    `;

    await sendEmail({
      to: user.email,
      subject,
      html: emailTemplate(
        subject,           // Title
        message,           // Message
        user.name,         // userName
        user.email,        // userEmail
        user.userId,       // userId
        undefined,         // userAbstract
        undefined,         // finalPaperStatus
        "paid",            // paymentStatus
        undefined,         // rejectedReason
        undefined          // resetLink
      ),
    });
}
    console.log(`📧 Payment success email sent to: ${user.email}`);

    return res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("❌ Razorpay Verification Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Optional: Complete payment (after verification)
 */
export const completePaymentController = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const registration = await Registration.findOne({ userId });
    if (!registration) return res.status(404).json({ message: "Registration not found" });

    registration.payment.paymentStatus = "paid";
    registration.payment.paymentDate = new Date();
    await registration.save();

    await User.findByIdAndUpdate(userId, { paymentStatus: "paid" });
    await AbstractStatus.findOneAndUpdate(
      { userId },
      { paymentStatus: "paid" },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Payment completed successfully. You can download your hall ticket now.",
      registration,
    });
  } catch (err) {
    console.error("❌ Complete Payment Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};