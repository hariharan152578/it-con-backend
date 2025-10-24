

import express from "express";
import { authRequest } from "../middleware/authMiddleware.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  completePaymentController 
} from "../controllers/paymentController.js"; // Stripe controller

const router = express.Router();

// ------------------ CREATE STRIPE PAYMENT INTENT ------------------
router.post("/create-payment", authRequest, createRazorpayOrder );

// ------------------ CONFIRM STRIPE PAYMENT ------------------
router.post("/verify-payment", authRequest, verifyRazorpayPayment );
router.get("/complete-payment", authRequest, completePaymentController);
export default router;

