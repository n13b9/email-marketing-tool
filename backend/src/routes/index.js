import express from "express";
import workflowRoutes from "./workflowRoutes.js";
import emailRoutes from "./emailRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

// Use workflow routes
router.use("/workflows", workflowRoutes);

// Use email routes
router.use("/email", emailRoutes);

// Use user routes
router.use("/users", userRoutes);

export default router;
