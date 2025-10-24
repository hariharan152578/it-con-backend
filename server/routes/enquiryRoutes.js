



import express from "express";
import multer from "multer";
import {
  createEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
} from "../controllers/enquiryController.js";
import { authRequest, protectAdmin, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Multer setup for multiple files
const storage = multer.memoryStorage();
const upload = multer({ storage });

// User enquiry route (supports unlimited proofs)
router.post("/", authRequest, upload.single("file"), createEnquiry); 
// no max limit

// Admin routes
router.get("/", protectAdmin, admin, getAllEnquiries);
router.put("/:id", protectAdmin, admin, updateEnquiryStatus);

export default router;
