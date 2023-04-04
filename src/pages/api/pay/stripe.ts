import type { NextApiRequest, NextApiResponse } from 'next';
import { Logger } from '@/server/logger';
import { createPaymentMethod, createPaymentIntent } from '@/server/stripe';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const logger = new Logger();
  const { token } = req.body;

  logger.log(`CHARGING WITH stripe:`);
  const paymentMethod = await createPaymentMethod(token, logger);

  logger.log('Created Payment Method:');
  logger.log(paymentMethod);

  const paymentIntent = await createPaymentIntent(paymentMethod, logger);

  logger.log('Created Payment Intent:');
  logger.log(paymentIntent);

  res.status(200).json({
    paymentMethod,
    paymentIntent,
    logs: logger.getLogs(),
  });
};

export default handler;
