import express from "express";
import { protectRoute, adminRoute, ownerRoute, restrictTo, userRoute } from '../middleware/auth_middleware.js';
import { createBookingPayment } from "../controllers/payment_controller.js";

const router = express.Router();

router.post("/pay", protectRoute, createBookingPayment);

export default router;
