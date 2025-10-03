import { Router } from "express";
import { submitRegistration, uploadFinalPaper, createPhonePeOrder,phonePeCallback  } from "../controllers/registerController.js";
import { authRequest } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = Router();

// Step 1: Abstract submission
router.post("/", authRequest, upload.array("proofs", 4), submitRegistration);


// Step 2: Final paper upload (after admin approval)
router.post("/paper", authRequest, upload.single("file"), uploadFinalPaper);

// Create PhonePe payment order
router.post("/phonepe/create-order", authRequest, createPhonePeOrder);

// Callback from PhonePe
router.post("/phonepe/callback", phonePeCallback);

export default router;
