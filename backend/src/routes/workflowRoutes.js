import express from "express";
import {
  saveWorkflow,
  getWorkflows,
} from "../controllers/workflowController.js";

const router = express.Router();

// Workflow routes
router.post("/", saveWorkflow);
router.get("/", getWorkflows);

export default router;
