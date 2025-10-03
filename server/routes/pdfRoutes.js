import express from "express";
import { downloadHallTicket } from "../controllers/paymentController.js";

const router = express.Router();

router.get("/download-hall-ticket/:token", downloadHallTicket);

export default router;
