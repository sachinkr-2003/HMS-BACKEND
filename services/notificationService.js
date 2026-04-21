const twilio = require('twilio');

// Configuration - Usually loaded from .env
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;
const WHATSAPP_PHONE = process.env.TWILIO_WHATSAPP_NUMBER;

let client;
// Twilio SID must start with 'AC' to be valid
if (TWILIO_SID && TWILIO_SID.startsWith('AC') && TWILIO_AUTH_TOKEN) {
    client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
} else {
    console.warn('TWILIO: Invalid or missing Account SID (must start with AC). SMS/WhatsApp will run in Simulation Mode.');
}

/**
 * Sends a real SMS notification using Twilio
 * @param {string} to - Recipient phone number with country code
 * @param {string} message - Message body
 */
const sendSMS = async (to, message) => {
    if (!client) {
        console.warn('TWILIO: Not configured. SMS log:', { to, message });
        return { success: false, error: 'Twilio not configured' };
    }

    try {
        const response = await client.messages.create({
            body: message,
            from: TWILIO_PHONE,
            to: to
        });
        console.log(`TWILIO: SMS sent to ${to}. SID: ${response.sid}`);
        return { success: true, sid: response.sid };
    } catch (error) {
        console.error(`TWILIO: Failed to send SMS to ${to}`, error);
        return { success: false, error: error.message };
    }
};

/**
 * Sends a WhatsApp message using Twilio WhatsApp API
 * @param {string} to - Recipient phone number (format: whatsapp:+91xxxxxxxxxx)
 * @param {string} message - Message body
 */
const sendWhatsApp = async (to, message) => {
    if (!client) {
        console.warn('TWILIO: Not configured. WhatsApp log:', { to, message });
        return { success: false, error: 'Twilio WhatsApp not configured' };
    }

    try {
        const response = await client.messages.create({
            from: `whatsapp:${WHATSAPP_PHONE}`,
            body: message,
            to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`
        });
        console.log(`TWILIO: WhatsApp sent to ${to}. SID: ${response.sid}`);
        return { success: true, sid: response.sid };
    } catch (error) {
        console.error(`TWILIO: Failed to send WhatsApp to ${to}`, error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendSMS,
    sendWhatsApp
};
