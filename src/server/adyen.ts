const createPayment = async (basisTheoryToken: string) => {
  const response = await fetch('https://api.basistheory.com/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-API-key': `${process.env.ADYEN_API_CREDENTIAL}`,
      'BT-PROXY-URL': 'https://checkout-test.adyen.com/v69/payments',
      'BT-API-KEY': `${process.env.BASIS_THEORY_PRIVATE}`,
    },
    body: JSON.stringify({
      amount: {
        currency: 'USD',
        value: 2000,
      },
      reference: '123456789',
      paymentMethod: {
        type: 'scheme',
        number: `{{${basisTheoryToken} | json: '$.number'}}`,
        expiryMonth: `{{${basisTheoryToken} | json: '$.expiration_month'}}`,
        expiryYear: `{{${basisTheoryToken} | json: '$.expiration_year'}}`,
        cvc: `{{${basisTheoryToken} | json: '$.cvc'}}`,
      },
      authenticationData: {
        threeDSRequestData: {
          nativeThreeDS: 'preferred',
        },
      },
      shopperEmail: 's.hopper@test.com',
      shopperIP: '192.0.2.1',
      channel: 'web',
      origin: 'http://localhost:3000',
      returnUrl: 'http://localhost:3000/checkout/',
      merchantAccount: 'BasisTheoryECOM',
      browserInfo: {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
        acceptHeader:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        language: 'nl-NL',
        colorDepth: 24,
        screenHeight: 723,
        screenWidth: 1536,
        timeZoneOffset: 0,
        javaEnabled: true,
      },
    }),
  });

  const data = await response.json();

  return data;
};

const addPaymentDetails = async (details: any) => {
  const response = await fetch(
    'https://checkout-test.adyen.com/v69/payments/details',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-API-key': `${process.env.ADYEN_API_CREDENTIAL}`,
      },
      body: JSON.stringify({
        details,
      }),
    }
  );
  const data = await response.json();

  return data;
};

export { createPayment, addPaymentDetails };
