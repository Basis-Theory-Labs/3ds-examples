import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Logger } from '@/server/logger';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const logger = new Logger();
  const { token, browserInfo } = req.body;

  logger.log(`Charging with Spreedly:`);

  const { data: paymentMethodResponse } = await axios.post(
    'https://api.basistheory.com/proxy',
    {
      payment_method: {
        credit_card: {
          first_name: 'Joe',
          last_name: 'Jones',
          number: `{{ ${token} | json: '$.number' }}`,
          month: `{{ ${token} | json: '$.expiration_month' | to_string }}`,
          year: `{{ ${token} | json: '$.expiration_year' | to_string }}`,
          verification_value: `{{ ${token} | json: '$.cvc' }}`,
        },
      },
    },
    {
      auth: {
        username: process.env.NEXT_PUBLIC_SPREEDLY_ENVIRONMENT_KEY,
        password: process.env.SPREEDLY_ACCESS_SECRET,
      },
      headers: {
        'BT-PROXY-URL': 'https://core.spreedly.com/v1/payment_methods.json',
        'BT-API-KEY': process.env.BASIS_THEORY_PRIVATE_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  logger.log('Created Payment Method:');
  logger.log(paymentMethodResponse.transaction);

  const { data: purchaseResponse } = await axios.post(
    `https://core.spreedly.com/v1/gateways/${process.env.SPREEDLY_TEST_GATEWAY}/purchase.json`,
    {
      transaction: {
        sca_provider_key: process.env.SPREEDLY_SCA_PROVIDER_KEY,
        payment_method_token:
          paymentMethodResponse.transaction.payment_method.token,
        amount: 2000,
        sca_authentication_parameters: {
          test_scenario: {
            scenario: 'challenge',
          },
        },
        currency_code: 'EUR',
        browser_info: browserInfo,
      },
    },
    {
      auth: {
        username: process.env.NEXT_PUBLIC_SPREEDLY_ENVIRONMENT_KEY,
        password: process.env.SPREEDLY_ACCESS_SECRET,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  logger.log('Submitted Payment Method:');
  logger.log(purchaseResponse.transaction);

  res.status(200).json({
    logs: logger.getLogs(),
    transactionToken: purchaseResponse.transaction.token,
  });
};

export default handler;
