import type { NextApiRequest, NextApiResponse } from 'next';
import { addPaymentDetails } from '@/server/adyen';
import { Logger } from '@/server/logger';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const logger = new Logger();
  const { details } = req.body;

  logger.log(`CONFIRMING PAYMENT WITH adyen:`);
  const result = await addPaymentDetails(details);

  logger.log('Added Details:');
  logger.log(result);

  res.status(200).json({
    result,
    logs: logger.getLogs(),
  });
};

export default handler;
