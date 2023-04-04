import type { PaymentMethod } from '@stripe/stripe-js';
import * as qs from 'qs';
import Stripe from 'stripe';
import type { Logger } from './logger';

const stripe = new Stripe(process.env.STRIPE_PRIVATE_PRIVATE);

const createPaymentIntent = (paymentMethod: PaymentMethod, logger: Logger) => {
  logger.log('Creating Stripe Payment Intent:');
  logger.log(`Using Payment Method: ${paymentMethod.id}`);

  return stripe.paymentIntents.create({
    amount: 2000,
    currency: 'usd',
    payment_method_types: ['card'],
    payment_method: paymentMethod.id,
  });
};

const createPaymentMethodRequestBody = (token: string) => ({
  type: 'card',
  card: {
    number: `{{${token} | json: '$.number'}}`,
    exp_month: `{{${token} | json: '$.expiration_month'}}`,
    exp_year: `{{${token} | json: '$.expiration_year'}}`,
    cvc: `{{${token} | json: '$.cvc'}}`,
  },
});

const headers = {
  Authorization: `Basic ${Buffer.from(
    `${process.env.STRIPE_PRIVATE_PRIVATE}:`
  ).toString('base64')}`,
  'BT-PROXY-URL': 'https://api.stripe.com/v1/payment_methods',
  'BT-API-KEY': `${process.env.BASIS_THEORY_PRIVATE_KEY}`,
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
};

const createPaymentMethod = async (
  basisTheoryToken: string,
  logger: Logger
) => {
  const body = qs.stringify(createPaymentMethodRequestBody(basisTheoryToken));

  logger.log('Creating Stripe Payment Method via BT /proxy:');
  logger.log('Payment Method Body:');
  logger.log(body);

  return (
    await fetch('https://api.basistheory.com/proxy', {
      method: 'POST',
      headers,
      body,
    })
  ).json();
};

export { createPaymentMethod, createPaymentIntent };
