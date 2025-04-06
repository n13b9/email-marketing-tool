import transporter from "../config/nodemailer.js";

class EmailService {
  /**
   * Send an email
   * @param {Object} params
   * @param {string} params.to - Recipient email
   * @param {string} params.subject - Email subject
   * @param {string} params.text - Email body
   * @returns {Promise<Object>} Result of sending email
   */
  async sendEmail({ to, subject, text }) {
    try {
      const mailOptions = {
        from: `"Agenda Email Service" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">${subject}</h2>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
              ${text.replace(/\n/g, "<br>")}
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              This is an automated email from Agenda Email Service.
            </p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  /**
   * Verify email service connection
   * @returns {Promise<boolean>} Whether the connection is successful
   */
  async verifyConnection() {
    try {
      await transporter.verify();
      return true;
    } catch (error) {
      console.error("Email service connection failed:", error);
      return false;
    }
  }
}

export default new EmailService();
