import express from "express";
import { createOrder, completePayment } from "../controllers/paymentController.js";
import { authRequest } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", authRequest, createOrder);
router.get("/complete-payment", authRequest, completePayment);

export default router;
