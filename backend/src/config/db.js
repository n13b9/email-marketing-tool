import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const connectDB = async (retryCount = 0) => {
  try {
    const mongoUri = process.env.MONGO_URI?.trim();

    // Enhanced logging
    console.log("\n=== MongoDB Connection Attempt ===");
    console.log(`Retry count: ${retryCount}`);
    console.log("Environment check:", {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      MONGO_URI: mongoUri ? "defined" : "undefined",
    });

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const uriDisplay =
      mongoUri.length > 30
        ? `${mongoUri.substring(0, 20)}...${mongoUri.substring(
            mongoUri.length - 10
          )}`
        : mongoUri;
    console.log(`Connecting to MongoDB with URI: ${uriDisplay}`);

    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
    };

    console.log("Attempting to connect with options:", options);
    const conn = await mongoose.connect(mongoUri, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    console.log(`MongoDB Version: ${conn.connection.version}`);

    return conn;
  } catch (error) {
    console.error("\n❌ MongoDB connection failed:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    if (error.code) {
      console.error("Error code:", error.code);
    }

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return connectDB(retryCount + 1);
    }

    console.error("Max retries reached. Exiting...");
    process.exit(1);
  }
};

mongoose.connection.on("connecting", () => {
  console.log("🔄 Establishing MongoDB connection...");
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️  MongoDB disconnected!");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔁 MongoDB reconnected!");
});

mongoose.connection.on("error", (error) => {
  console.error("❗ MongoDB connection error:", error);
});

export default connectDB;
