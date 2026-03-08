const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Centralized Email Service
 */
const emailService = {
    /**
     * Send basic email using Resend
     */
    async sendEmail({ to, subject, html, from = 'DashDrive <onboarding@resend.dev>' }) {
        try {
            console.log(`[EmailService] Sending email to ${to}...`);
            const { data, error } = await resend.emails.send({
                from,
                to,
                subject,
                html,
            });

            if (error) {
                console.error('[EmailService] Resend error:', error);
                return { success: false, error };
            }

            console.log('✅ Email sent successfully:', data.id);
            return { success: true, data };
        } catch (err) {
            console.error('[EmailService] Catch error:', err.message);
            return { success: false, error: err.message };
        }
    },

    /**
     * Send Welcome Email to new Merchants
     */
    async sendWelcomeEmail(email, storeName) {
        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
                <h1 style="color: #00C853;">Welcome to DashDrive!</h1>
                <p>Hi <strong>${storeName}</strong>,</p>
                <p>Thanks for joining the DashDrive ecosystem. We're excited to help you grow your business and streamline your deliveries.</p>
                <p>Your account is currently <strong>Pending Verification</strong>. Our team will review your details and get back to you shortly.</p>
                <br/>
                <p>Best regards,<br/>The DashDrive Team</p>
            </div>
        `;
        return this.sendEmail({ to: email, subject: 'Welcome to DashDrive!', html });
    }
};

module.exports = emailService;
