import { Router } from "express";
import {
  adminReviewPaper,
  userUploadCorrectionPaper,
} from "../controllers/paperReviewController.js";
import { authRequest, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = Router();

// Admin reviews paper
router.post("/admin/review/:userId", authRequest, admin, adminReviewPaper);

// User uploads corrected paper
router.post("/user/correction", authRequest, upload.single("file"), userUploadCorrectionPaper);

export default router;
