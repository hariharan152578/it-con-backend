// // import express from "express";
// // import dotenv from "dotenv";
// // import cookieParser from "cookie-parser";
// // import cors from "cors";
// // import path from "path";
// // import { fileURLToPath } from "url";

// // import connectDB from "./config/mongodb.js";

// // import authRoutes from "./routes/authRoutes.js";
// // import registerRoutes from "./routes/registerRoutes.js";
// // import userRoutes from "./routes/userRoutes.js";
// // import statusRoutes from "./routes/statusRoutes.js";
// // import adminRoutes from "./routes/adminRoutes.js";

// // dotenv.config();
// // const app = express();
// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // // DB
// // await connectDB();

// // // Middleware
// // app.use(cors({
// //   origin: process.env.CLIENT_ORIGIN?.split(",") || ["http://localhost:5173"],
// //   credentials: true
// // }));
// // app.use(express.json({ limit: "10mb" }));
// // app.use(express.urlencoded({ extended: true }));
// // app.use(cookieParser());

// // // Routes
// // app.use("/api/auth", authRoutes);
// // app.use("/api/register", registerRoutes);
// // app.use("/api/users/", userRoutes);
// // app.use("/api/status", statusRoutes);
// // app.use("/api/admin", adminRoutes);

// // // Health
// // app.get("/health", (req, res) => res.json({ ok: true }));

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));


// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

// import connectDB from "./config/mongodb.js";
// import registerRoutes from "./routes/registerRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// // import statusRoutes from "./routes/statusRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";

// dotenv.config();
// const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Middleware
// app.use(
//   cors({
//     origin: process.env.CLIENT_ORIGIN?.split(",") || ["http://localhost:5173"],
//     credentials: true,
//   })
// );
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Routes
// // app.use("/api/auth", authRoutes);
// app.use("/api/register", registerRoutes);
// app.use("/api/users", userRoutes); // 🔥 removed trailing slash
// app.use("/api/admin", adminRoutes);

// // Health
// app.get("/health", (req, res) => res.json({ ok: true }));

// // Start Server
// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () =>
//       console.log(`✅ Server running on http://localhost:${PORT}`)
//     );
//   } catch (err) {
//     console.error("❌ Failed to start server:", err.message);
//     process.exit(1);
//   }
// };

// startServer();

// server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/mongodb.js";
import registerRoutes from "./routes/registerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
// import statusRoutes from "./routes/statusRoutes.js";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CORS Setup ---
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map(o => o.trim()) // ✅ fix: trim spaces/newlines
  : ["https://it-conference.netlify.app", "http://localhost:5173","http://localhost:5174"];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin); // exact origin
    res.setHeader("Access-Control-Allow-Credentials", "true"); // allow cookies
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  // ✅ handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // 204 No Content
  }

  next();
});

// --- Middleware ---
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Routes ---
app.use("/api/register", registerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
// app.use("/api/status", statusRoutes);

// --- Health Check ---
app.get("/health", (req, res) => res.json({ ok: true }));

// --- Start Server ---
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
    console.log("✅ Allowed Origins:", allowedOrigins);
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
