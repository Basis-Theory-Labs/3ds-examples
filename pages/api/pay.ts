import type { NextApiRequest, NextApiResponse } from 'next'
import {createPaymentMethodFromToken} from "../../components/stripe/createPaymentMethod";
import {Logger} from "../../components/serversideLogger";
import {createPaymentIntentFromPaymentMethod} from "../../components/stripe/createPaymentIntent";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const logger = new Logger();
  const {token, chargeWith} = JSON.parse(req.body);

  const paymentMethod = await createPaymentMethodFromToken(token, logger);
  logger.log("Created Payment Method:")
  logger.log(paymentMethod)

  logger.log(`CHARGING WITH: ${chargeWith}:`)
  const paymentIntent = await createPaymentIntentFromPaymentMethod(paymentMethod, logger);
  logger.log("Created Payment Intent:")
  logger.log(paymentIntent)

  res.status(200).json(
      {
        chargedWith: 'stripe',
        stripe: {paymentMethod, paymentIntent},
        logs: logger.getLogs()
      })
}
