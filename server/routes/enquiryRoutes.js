import express from "express";
import { createEnquiry, getAllEnquiries } from "../controllers/enquiryController.js";
import { authRequest, protectAdmin, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// User enquiry route
router.post("/", authRequest, createEnquiry);

// Admin routes
router.get("/", protectAdmin, admin, getAllEnquiries);

export default router;