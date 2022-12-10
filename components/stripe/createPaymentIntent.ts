import type { Logger } from '../serversideLogger';
import type {PaymentMethod} from "@stripe/stripe-js";

export const createPaymentIntentFromPaymentMethod = async (paymentMethod: PaymentMethod, logger: Logger) => {
    const stripe = require("stripe")(process.env.STRIPE_PRIVATE_PRIVATE)
    logger.log("Creating Stripe Payment Intent:")
    logger.log(`Using Payment Method: ${paymentMethod.id}`)

    return await stripe.paymentIntents.create({
        amount: 2000,
        currency: 'usd',
        payment_method_types: ['card'],
        payment_method: paymentMethod.id
    });
}