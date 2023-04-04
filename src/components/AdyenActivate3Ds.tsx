import React, { useEffect, useRef } from 'react';
import adyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';
import type { PaymentAction } from '@adyen/adyen-web/dist/types/types';

interface Props {
  action: PaymentAction;
  handleOnAdditionalDetails: (state: unknown, component: unknown) => unknown;
}

export const AdyenActivate3Ds = ({
  action,
  handleOnAdditionalDetails,
}: Props) => {
  const started = useRef(false);

  const kickOff = async () => {
    console.debug('CLIENT:', 'Payment requires 3DS.');
    console.debug('CLIENT:', 'Show 3DS form for 3DS Action:');
    console.debug('CLIENT:', action);

    const configuration = {
      locale: 'en_US',
      environment: 'test', // For live payments, change this to a live environment.
      clientKey: 'test_MYOBXH55OZAZHFG3H2SAZSBHEEJXLN5I',
      onAdditionalDetails: handleOnAdditionalDetails,
      onError: console.error,
    };

    const checkout = await adyenCheckout(configuration);

    checkout.createFromAction(action).mount('#adyen-3ds-container');
  };

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      kickOff().catch();
    }
    // this code should run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id="adyen-3ds-container" style={{ backgroundColor: 'white' }} />;
};
