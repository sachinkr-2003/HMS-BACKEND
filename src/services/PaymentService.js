const Razorpay = require('razorpay');
const stripe = require('stripe');

/**
 * Institutional Fiscal Gateway
 * Manages all monetary transactions and payment cryptology
 */
class PaymentService {
    constructor() {
        // Razorpay Initialization
        if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
            this.razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });
        }

        // Stripe Initialization
        if (process.env.STRIPE_SECRET_KEY) {
            this.stripe = stripe(process.env.STRIPE_SECRET_KEY);
        }
    }

    /**
     * Create Fiscal Order (Razorpay)
     */
    async createRazorpayOrder(amount, receiptId) {
        const options = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: receiptId,
        };

        try {
            if (this.razorpay) {
                const order = await this.razorpay.orders.create(options);
                return order;
            } else {
                // Simulation for testing
                return { id: `ORDER_SIM_${Date.now()}`, amount: options.amount, status: 'simulated' };
            }
        } catch (error) {
            throw new Error(`Fiscal Transaction Initialization Failed: ${error.message}`);
        }
    }

    /**
     * Initialize Payment Intent (Stripe)
     */
    async createStripeIntent(amount, currency = 'inr') {
        try {
            if (this.stripe) {
                const intent = await this.stripe.paymentIntents.create({
                    amount: amount * 100,
                    currency,
                    payment_method_types: ['card'],
                });
                return intent;
            } else {
                return { client_secret: `STRIPE_SIM_SECRET_${Date.now()}`, status: 'simulated' };
            }
        } catch (error) {
            throw new Error(`Stripe Intent Failure: ${error.message}`);
        }
    }

    /**
     * Verify Transaction Integrity
     */
    verifyRazorpaySignature(orderId, paymentId, signature) {
        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(orderId + "|" + paymentId);
        const generated_signature = hmac.digest('hex');
        return generated_signature === signature;
    }
}

module.exports = new PaymentService();
