// import { Router } from "express";
// import { registerUser, loginUser, getMe, logoutUser } from "../controllers/userController.js";
// import { authRequest } from "../middleware/authMiddleware.js";

// const router = Router();

// router.post("/signup", registerUser);
// router.post("/signin", loginUser);
// router.get("/me", authRequest, getMe);
// router.post("/logout", logoutUser);

// export default router;


import { Router } from "express";
import { registerUser, loginUser, getMe, logoutUser } from "../controllers/userController.js";
import { authRequest } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", registerUser);
router.post("/signin", loginUser);
router.get("/me", authRequest, getMe);
router.post("/logout", logoutUser);

export default router;
