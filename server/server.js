// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import cors from "cors"

// import cookieParser from "cookie-parser";
// import path from "path";
// import { fileURLToPath } from "url";
// import connectDB from "./config/mongodb.js";
// import registerRoutes from "./routes/registerRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import enquiries from "./routes/enquiryRoutes.js"


// const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(cors());
// // --- CORS Setup ---
// const allowedOrigins = process.env.CLIENT_ORIGIN
//   ? process.env.CLIENT_ORIGIN.split(",").map(o => o.trim()) // ✅ fix: trim spaces/newlines
//   : ["https://it-conference.netlify.app", "http://localhost:5173"];

// app.use((req, res, next) => {
//   const origin = req.headers.origin;

//   if (origin && allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin); // exact origin
//     res.setHeader("Access-Control-Allow-Credentials", "true"); // allow cookies
//   }

//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET,POST,PUT,DELETE,OPTIONS"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization, X-Requested-With"
//   );

//   // ✅ handle preflight requests
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(204); // 204 No Content
//   }

//   next();
// });

// // --- Middleware ---
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // --- Routes ---
// app.use("/api/register", registerRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/enquiries",enquiries);
// app.use("/api/payments", paymentRoutes); 
// // --- Health Check ---
// app.get("/health", (req, res) => res.json({ ok: true }));

// // --- Start Server ---
// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () =>
//       console.log(`✅ Server running on http://localhost:${PORT}`)
//     );
//     console.log("✅ Allowed Origins:", allowedOrigins);
//   } catch (err) {
//     console.error("❌ Failed to start server:", err.message);
//     process.exit(1);
//   }
// };

// startServer();
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/mongodb.js";
import registerRoutes from "./routes/registerRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import enquiries from "./routes/enquiryRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ --- CORS Setup (only this, no default cors() call) ---
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map(o => o.trim())
  : ["https://it-conference.netlify.app", "http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ allow cookies / auth
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// ✅ Handle preflight requests explicitly
app.options("*", cors());

// --- Middleware ---
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Routes ---
app.use("/api/register", registerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/enquiries", enquiries);
app.use("/api/payments", paymentRoutes);

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
