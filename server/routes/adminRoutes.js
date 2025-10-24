

import express from "express";
import { protectAdmin, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js"; // For file uploads
import { registerAdmin,getAllUsers,loginAdmin,updateAbstractAndPaper } from "../controllers/adminController.js";

const router = express.Router();

// ------------------ Admin Authentication Routes ------------------
router.post("/signup", registerAdmin); // optional
router.post("/login", loginAdmin); // optional

// ------------------ Get all users ------------------
router.get("/users", protectAdmin, admin, getAllUsers);

// ------------------ Update Abstract / Final Paper ------------------
router.put(
  "/update/:userId",
  protectAdmin,
  admin,
  upload.single("file"), // only required for corrections
  updateAbstractAndPaper
);

export default router;

