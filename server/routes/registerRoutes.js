// import { Router } from "express";
// import { submitRegistration, uploadFinalPaper, processPayment } from "../controllers/registerController.js";
// import { authRequest } from "../middleware/constants.js";
// import upload from "../middleware/multer.js";

// const router = Router();

// // Step 1: Abstract submission
// router.post("/", authRequest, submitRegistration);

// // Step 2: Final paper upload (after admin approval)
// router.post("/paper", authRequest, upload.single("file"), uploadFinalPaper);

// // Step 3: Payment (after final paper approved)
// router.post("/payment", authRequest, processPayment);

// export default router;


import { Router } from "express";
import { submitRegistration, uploadFinalPaper, processPayment } from "../controllers/registerController.js";
import { authRequest } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = Router();

// router.post("/", authRequest,upload.single("proof"), submitRegistration);
// router.post(
//   "/",
//   authRequest,
//   upload.single("proof"),
//   submitRegistration
// ); 
router.post(
  "/",
  authRequest,
  upload.array("proofs", 4), // accept up to 4 files with key = "proofs"
  submitRegistration
);
router.post("/paper", authRequest, upload.single("file"), uploadFinalPaper);
router.post("/payment", authRequest, processPayment);

export default router;
