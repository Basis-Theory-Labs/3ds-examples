import { useEffect, useRef } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import type { PaymentIntent, PaymentIntentResult } from '@stripe/stripe-js';

interface Props {
  paymentIntent: PaymentIntent;
  onDone: (errorMessage?: string) => unknown;
}

const StripeActivate3Ds = ({ paymentIntent, onDone }: Props) => {
  const stripe = useStripe();
  const started = useRef(false);

  const kickOff = async () => {
    console.debug('CLIENT:', 'Payment requires 3DS.');
    console.debug('CLIENT:', 'Show 3DS form for Payment Intent:');
    console.debug('CLIENT:', paymentIntent);

    const threeDSPaymentIntent: PaymentIntentResult =
      await stripe?.confirmCardPayment(paymentIntent.client_secret as string);

    console.debug('CLIENT:', `Completed 3DS`);
    onDone(threeDSPaymentIntent?.error?.message);
  };

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      kickOff().catch();
    }
    // this code should run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return false;
};

export { StripeActivate3Ds };
