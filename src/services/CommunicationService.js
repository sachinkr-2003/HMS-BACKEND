const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

/**
 * Institutional Communication Relay
 * Handles all outgoing encrypted signals (Email/SMS)
 */
class CommunicationService {
    constructor() {
        if (process.env.SENDGRID_API_KEY) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        }
        
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            this.smsClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        }
    }

    /**
     * Send Institutional Dispatch (Email)
     */
    async sendEmail(to, subject, text, html) {
        const msg = {
            to,
            from: process.env.SYSTEM_EMAIL || 'notifications@healthrekha.com',
            subject: `[Institutional Alert] ${subject}`,
            text,
            html: html || `<p>${text}</p>`,
        };

        try {
            if (process.env.NODE_ENV === 'production' && process.env.SENDGRID_API_KEY) {
                await sgMail.send(msg);
                console.log(`Dispatch sent to: ${to}`);
            } else {
                console.log('--- DEVELOPMENT MODE: EMAIL SIMULATED ---');
                console.log(`To: ${to}\nSubject: ${subject}\nBody: ${text}`);
                console.log('------------------------------------------');
            }
        } catch (error) {
            console.error('Dispatch Failure:', error);
        }
    }

    /**
     * Send SMS Alert (Twilio)
     */
    async sendSMS(to, message) {
        try {
            if (process.env.NODE_ENV === 'production' && this.smsClient) {
                await this.smsClient.messages.create({
                    body: `Institutional HMS: ${message}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to
                });
                console.log(`SMS Alert sent to: ${to}`);
            } else {
                console.log('--- DEVELOPMENT MODE: SMS SIMULATED ---');
                console.log(`To: ${to}\nMessage: ${message}`);
                console.log('------------------------------------------');
            }
        } catch (error) {
            console.error('SMS Transmission Failure:', error);
        }
    }
}

module.exports = new CommunicationService();
