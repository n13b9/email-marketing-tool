import express from "express";
import agendaService from "../services/agendaService.js";
import Template from "../models/templateModel.js";

const router = express.Router();

// Schedule an email
router.post("/schedule", async (req, res) => {
  try {
    const { to, subject, text, delayMinutes } = req.body;

    // Validate required fields
    if (!to || !subject || !text || !delayMinutes) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: to, subject, text, delayMinutes",
      });
    }

    // Schedule the email with delay
    const jobId = await agendaService.scheduleEmail({
      to,
      subject,
      text,
      delayMinutes,
    });

    console.log("dealy minutes", delayMinutes);

    res.status(200).json({
      success: true,
      data: {
        jobId,
        message: `Email scheduled to be sent in ${delayMinutes} minutes`,
        scheduledTime: new Date(Date.now() + delayMinutes * 60 * 1000),
      },
    });
  } catch (error) {
    console.error("Error scheduling email:", error);
    res.status(500).json({
      success: false,
      error: "Error scheduling email",
    });
  }
});

router.post("/template", async (req, res) => {
  try {
    const { name, subject, body } = req.body;
    if (!name || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }
    console.log("template", name, subject, body);
    const template = await Template.create({ name, subject, body });
    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error("Error çreating template:", error);
    res.status(500).json({
      success: false,
      error: "Error creating template",
    });
  }
});

router.get("/templates", async (req, res) => {
  try {
    const templates = await Template.find();
    res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get status of a scheduled email
router.get("/status/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const status = await agendaService.getEmailStatus(jobId);
    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error("Error getting email status:", error);
    res.status(500).json({
      success: false,
      error: "Error getting email status",
    });
  }
});

// Cancel a scheduled email
router.delete("/cancel/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    await agendaService.cancelEmail(jobId);
    res.status(200).json({
      success: true,
      message: "Email cancelled successfully",
    });
  } catch (error) {
    console.error("Error canceling email:", error);
    res.status(500).json({
      success: false,
      error: "Error canceling email",
    });
  }
});

// Get all scheduled emails
router.get("/scheduled", async (req, res) => {
  try {
    const emails = await agendaService.getScheduledEmails();
    res.status(200).json({
      success: true,
      data: emails,
    });
  } catch (error) {
    console.error("Error getting scheduled emails:", error);
    res.status(500).json({
      success: false,
      error: "Error getting scheduled emails",
    });
  }
});

export default router;
