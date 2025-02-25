import express from "express";
const router = express.Router();

import authRoutes from "./auth.routes.js";
router.use("/auth", authRoutes);

import customerRoutes from "./customer.routes.js";
router.use("/customers", customerRoutes);

export default router;
