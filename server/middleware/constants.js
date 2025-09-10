import jwt from "jsonwebtoken";

// ✅ Generate Token (global)
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// ✅ Auth Request Middleware (global)
export const authRequest = (req, res, next) => {
 const authHeader = req.headers.authorization;
 console.log(authHeader);
 
  const token = authHeader?.split(" ")[1];
console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 store both userId and raw token
    req.user = { id: decoded.id, token };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// ✅ Email Configuration (global placeholder)
export const emailConfig = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};
