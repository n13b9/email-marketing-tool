import express from "express";
import userService from "../services/userService.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const user = await userService.createUser({ email, password });
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(400).json({
      success: false,
      error: error.message || "Error creating user",
    });
  }
});

router.get("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await userService.getUser(email);
    console.log("User:", user);

    // Validate the password (assuming you're using bcrypt for hashing)
    if (user && (await user.comparePassword(password))) {
      // Return the user object (excluding sensitive data like password)
      res.status(200).json({
        id: user._id,
        email: user.email,
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user by email
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userService.getUser(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({
      success: false,
      error: "Error getting user",
    });
  }
});

// Verify password
router.post("/verify-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const isValid = await userService.verifyPassword(email, password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password verified successfully",
    });
  } catch (error) {
    console.error("Error verifying password:", error);
    res.status(500).json({
      success: false,
      error: "Error verifying password",
    });
  }
});

export default router;
