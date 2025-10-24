// // import jwt from "jsonwebtoken";
// // import asyncHandler from "express-async-handler";
// // import Admin from "../models/adminModel.js";
// // // ✅ Generate Token (global)
// // export const generateToken = (id) => {
// //   return jwt.sign({ id }, process.env.JWT_SECRET, {
// //     expiresIn: `${process.env.JWT_EXPIRES}`,
// //   });
// // };




// // // export const authRequest = (req, res, next) => {
// // //   const authHeader = req.headers.authorization;
// // //   const token = authHeader?.split(" ")[1];
// // //   if (!token) {
// // //     return res.status(401).json({ message: "Not authorized, no token" });
// // //   }

// // //   try {
// // //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// // //     req.user = { id: decoded.id, token }; // store both id + raw token
// // //     next();
// // //   } catch (error) {
// // //     return res.status(401).json({ message: "Not authorized, token failed", error: error.message });
// // //   }
// // // };

// // // ✅ Auth Request Middleware (global)
// // export const authRequest = (req, res, next) => {
// //  const authHeader = req.headers.authorization;
 
 
// //   const token = authHeader?.split(" ")[1];


// //   if (!token) {
// //     return res.status(401).json({ message: "Not authorized, no token" });
// //   }

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //     // 🔥 store both userId and raw token
// //     req.user = { id: decoded.id, token };

// //     next();
// //   } catch (error) {
// //     return res.status(401).json({ message: "Not authorized, token failed" });
// //   }
// // };

// // export const protectAdmin = asyncHandler(async (req, res, next) => {
// //   let token;

// //   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
// //     try {
// //       token = req.headers.authorization.split(" ")[1];

// //       // Verify JWT
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //       // Attach admin to req.user (✅ so it works with your admin middleware)
// //       req.user = await Admin.findById(decoded.id).select("-password");

// //       if (!req.user) {
// //         return res.status(401).json({ message: "Not authorized, admin not found" });
// //       }

// //       next();
// //     } catch (error) {
// //       return res.status(401).json({ message: "Not authorized, token failed" });
// //     }
// //   } else {
// //     return res.status(401).json({ message: "Not authorized, no token" });
// //   }
// // });
// // export const admin = (req, res, next) => {
// //   if (req.user && req.user.role === "admin") {
// //     next();
// //   } else {
// //     res.status(403).json({ message: "Admin access only" });
// //   }
// // };


// import jwt from "jsonwebtoken";
// import asyncHandler from "express-async-handler";
// import User from "../models/userModel.js";
// import Admin from "../models/adminModel.js";

// // export const authRequest = asyncHandler(async (req, res, next) => {
// //   let token;
// //   if (req.headers.authorization?.startsWith("Bearer")) {
// //     token = req.headers.authorization.split(" ")[1];
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     console.log(decoded);
    
// //     req.user = await User.findById(decoded.id).select("-password");
// //   }
// //   if (!token) return res.status(401).json({ message: "Not authorized" });
// //   next();
// // });


// export const authRequest = asyncHandler(async (req, res, next) => {
//   let token;

//   try {
//     if (req.headers.authorization?.startsWith("Bearer")) {
//       token = req.headers.authorization.split(" ")[1];

//       if (!token) {
//         return res.status(401).json({ message: "Not authorized, token missing" });
//       }

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log("Decoded JWT:", decoded);

//       req.user = await User.findById(decoded.id).select("-password");

//       if (!req.user) {
//         return res.status(401).json({ message: "User not found" });
//       }
//     } else {
//       return res.status(401).json({ message: "Not authorized, no token" });
//     }

//     next();
//   } catch (error) {
//     console.error("JWT Error:", error.message);
//     return res.status(401).json({ message: "Not authorized, token invalid" });
//   }
// });


// export const protectAdmin = asyncHandler(async (req, res, next) => {
//   let token;
//   if (req.headers.authorization?.startsWith("Bearer")) {
//     token = req.headers.authorization.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await Admin.findById(decoded.id).select("-password");
//   }
//   if (!token) return res.status(401).json({ message: "Admin not authorized" });
//   next();
// });

// export const admin = (req, res, next) => {
//   if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
//   next();
// };

// export const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });




import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";

// ✅ Generate JWT Token
export const generateToken = (id) => 
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ✅ Auth Middleware for Users
export const authRequest = asyncHandler(async (req, res, next) => {
  let token;

  try {
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Not authorized, token missing" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT:", decoded);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("JWT Error (User):", error.message);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
});

// ✅ Auth Middleware for Admins
export const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;

  try {
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Admin not authorized, token missing" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Admin JWT:", decoded);

      req.user = await Admin.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "Admin not found" });
      }

      next();
    } else {
      return res.status(401).json({ message: "Admin not authorized, no token" });
    }
  } catch (error) {
    console.error("JWT Error (Admin):", error.message);
    return res.status(401).json({ message: "Admin not authorized, token invalid" });
  }
});

// ✅ Role-based Admin Check
export const admin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }
    next();
  } catch (error) {
    console.error("Admin Role Check Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
