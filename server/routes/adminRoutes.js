// import express from "express";
// import { getAllUsers, getUserById, updateUserApproval,registerAdmin,loginAdmin } from "../controllers/adminController.js";
// import { protectAdmin, admin } from "../middleware/authMiddleware.js";
// const router = express.Router();

// // Admin access only
// router.get("/users", protectAdmin, admin, getAllUsers);        // list all users
// router.get("/users/:id", protectAdmin, admin, getUserById);   // get user details
// router.put("/users/abstract-status/:id", protectAdmin, admin, updateUserApproval); // update workflow

// // Signup
// router.post("/signup", registerAdmin);
// // Login
// router.post("/login", loginAdmin);
// export default router;

import express from "express";
import { getAllUsers, updateUserApproval, registerAdmin, loginAdmin } from "../controllers/adminController.js";
import { protectAdmin, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", protectAdmin, admin, getAllUsers); 
router.put("/users/abstract/:id", protectAdmin, admin, updateUserApproval);

router.post("/signup", registerAdmin);
router.post("/login", loginAdmin);

export default router;
