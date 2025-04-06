import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import cors from "cors";
import { startAgenda } from "./config/agenda.js";

// Load environment variables first
dotenv.config();

// // Verify environment variables are loaded
// console.log("Environment check:", {
//   NODE_ENV: process.env.NODE_ENV,
//   PORT: process.env.PORT,
//   MONGO_URI: process.env.MONGO_URI ? "defined" : "undefined",
// });

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Email Marketing Sequence API" });
});

// Mount routes
app.use("/api", routes); //

// Start server and initialize services
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // First connect to MongoDB
    await connectDB();

    // Then start Agenda
    await startAgenda();

    // Finally start the Express server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
