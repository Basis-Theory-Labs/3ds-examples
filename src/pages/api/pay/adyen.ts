import type { NextApiRequest, NextApiResponse } from 'next';
import { createPayment } from '@/server/adyen';
import { Logger } from '@/server/logger';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const logger = new Logger();
  const { token } = req.body;

  logger.log(`CHARGING WITH adyen:`);
  const payment = await createPayment(token);

  logger.log('Created Payment:');
  logger.log(payment);

  res.status(200).json({
    payment,
    logs: logger.getLogs(),
  });
};

export default handler;
