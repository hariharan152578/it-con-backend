import { Router } from "express";
import { registerUser, loginUser, getMe, logoutUser, requestPasswordOtp,
  verifyOtp,
  resetPassword } from "../controllers/userController.js";
import { authRequest } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", registerUser);
router.post("/signin", loginUser);
router.get("/me", authRequest, getMe);
router.post("/logout", logoutUser);

router.post("/forgot-password", requestPasswordOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
export default router;