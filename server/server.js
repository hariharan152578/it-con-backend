// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

// import connectDB from "./config/mongodb.js";

// import authRoutes from "./routes/authRoutes.js";
// import registerRoutes from "./routes/registerRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import statusRoutes from "./routes/statusRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";

// dotenv.config();
// const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // DB
// await connectDB();

// // Middleware
// app.use(cors({
//   origin: process.env.CLIENT_ORIGIN?.split(",") || ["http://localhost:5173"],
//   credentials: true
// }));
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/register", registerRoutes);
// app.use("/api/users/", userRoutes);
// app.use("/api/status", statusRoutes);
// app.use("/api/admin", adminRoutes);

// // Health
// app.get("/health", (req, res) => res.json({ ok: true }));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));


import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/mongodb.js";

import registerRoutes from "./routes/registerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import statusRoutes from "./routes/statusRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
// app.use("/api/auth", authRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/users", userRoutes); // 🔥 removed trailing slash
// app.use("/api/status", statusRoutes);
app.use("/api/admin", adminRoutes);

// Health
app.get("/health", (req, res) => res.json({ ok: true }));

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();