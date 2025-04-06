import Agenda from "agenda";
import dotenv from "dotenv";
import emailService from "../services/emailService.js";

dotenv.config();

// Create a new Agenda instance
const agenda = new Agenda({
  db: {
    address: process.env.MONGO_URI,
    collection: "agendaJobs",
  },
  processEvery: "1 minute",
  defaultConcurrency: 5,
  maxConcurrency: 10,
  ensureIndex: true,
  autoIndex: true,
});

agenda.define("send email", async (job) => {
  try {
    const { to, subject, text } = job.attrs.data;

    const result = await emailService.sendEmail({
      to,
      subject,
      text,
    });

    return result;
  } catch (error) {
    console.error("Error in creating job:", error);
    throw error;
  }
});

const startAgenda = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await agenda.start();
    console.log(" Agenda started successfully");
  } catch (error) {
    console.error(" Error starting Agenda:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      name: error.name,
    });
    process.exit(1);
  }
};

export { agenda, startAgenda };
