import express from "express";
import { initiatePayment, confirmPayment } from "../controllers/paymentController.js";
import { authRequest } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", authRequest, initiatePayment);
router.post("/verify", authRequest, confirmPayment);

export default router;
