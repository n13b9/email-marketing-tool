import { agenda } from "../config/agenda.js";

class AgendaService {
  /**
   * Schedule an email to be sent after a delay
   * @param {Object} params
   * @param {string} params.to - Recipient email
   * @param {string} params.subject - Email subject
   * @param {string} params.text - Email body
   * @param {number} params.delayMinutes - Delay in minutes before sending
   * @returns {Promise<string>} Job ID
   */
  async scheduleEmail({ to, subject, text, delayMinutes }) {
    try {
      // Calculate the schedule time based on current time + delay
      const scheduleAt = new Date(Date.now() + delayMinutes * 60 * 1000);
      console.log("scheduleAt here", scheduleAt);

      const job = await agenda.schedule(scheduleAt, "send email", {
        to,
        subject,
        text,
      });
      return job.attrs._id;
    } catch (error) {
      console.error("Error scheduling email:", error);
      throw error;
    }
  }

  /**
   * Cancel a scheduled email
   * @param {string} jobId - The ID of the job to cancel
   */
  async cancelEmail(jobId) {
    try {
      await agenda.cancel({ _id: jobId });
    } catch (error) {
      console.error("Error canceling email:", error);
      throw error;
    }
  }

  /**
   * Get the status of a scheduled email
   * @param {string} jobId - The ID of the job to check
   * @returns {Promise<Object>} Job status
   */
  async getEmailStatus(jobId) {
    try {
      const job = await agenda.jobs({ _id: jobId });
      if (!job.length) {
        return { status: "not_found" };
      }

      const jobData = job[0].attrs;
      return {
        status: jobData.lastRunAt ? "completed" : "scheduled",
        nextRunAt: jobData.nextRunAt,
        lastRunAt: jobData.lastRunAt,
        failedAt: jobData.failedAt,
        failReason: jobData.failReason,
      };
    } catch (error) {
      console.error("Error getting email status:", error);
      throw error;
    }
  }

  /**
   * Get all scheduled emails
   * @returns {Promise<Array>} List of scheduled jobs
   */
  async getScheduledEmails() {
    try {
      return await agenda.jobs({ name: "send email" });
    } catch (error) {
      console.error("Error getting scheduled emails:", error);
      throw error;
    }
  }

  /**
   * Retry failed email jobs
   * @param {string} jobId - The ID of the job to retry
   */
  async retryFailedEmail(jobId) {
    try {
      const job = await agenda.jobs({ _id: jobId });
      if (job.length && job[0].attrs.failedAt) {
        await job[0].touch();
      }
    } catch (error) {
      console.error("Error retrying failed email:", error);
      throw error;
    }
  }

  /**
   * Clean up old completed jobs
   * @param {number} daysOld - Number of days old to clean up
   */
  async cleanupOldJobs(daysOld = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      await agenda.cancel({
        lastRunAt: { $lt: cutoffDate },
        name: "send email",
      });
    } catch (error) {
      console.error("Error cleaning up old jobs:", error);
      throw error;
    }
  }
}

export default new AgendaService();
