import express from "express";
const router = express.Router();

import authRoutes from "./auth.routes.js";
router.use("/auth", authRoutes);

const customerRoutes = require("./customer.routes.js");
app.use("/customers", customerRoutes);

export default router;
