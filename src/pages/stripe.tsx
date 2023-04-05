import React, { useRef, useState } from 'react';
import type { CardElementValue } from '@basis-theory/basis-theory-js/types/elements';
import { useBasisTheory } from '@basis-theory/basis-theory-react';
import type { PaymentIntent } from '@stripe/stripe-js';
import Head from 'next/head';
import { LogViewer, StripeActivate3Ds, CardElement } from '@/components';
import styles from '@/styles/Home.module.css';

const Stripe = () => {
  const { bt } = useBasisTheory();
  const cardRef = useRef(null);
  const [status, setStatus] = useState('Pay for your $20.00 fee');
  const [isBusy, setIsBusy] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent>();
  const [testCard, setTestCard] = useState<CardElementValue<'static'>>();

  const setElementValue = () => {
    setTestCard({
      number: '4000000000003220',
      expiration_month: 12,
      expiration_year: 32,
      cvc: '123',
    });
  };

  const callback3DS = (errorMessage?: string) => {
    setIsBusy(false);

    if (errorMessage) {
      setStatus(errorMessage);
      console.debug('CLIENT:', `3DS Failed with message: ${errorMessage}`);

      return;
    }

    console.debug('CLIENT:', 'Payment was successfully charged');
    setStatus('Payment successfully charged.');
  };

  const submit = async (): Promise<void> => {
    if (bt) {
      setIsBusy(true);
      console.debug(
        '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%'
      );
      console.debug(
        '%%%%%%%%%%%%%%%%%%%%%% STARTING PAYMENT FLOW %%%%%%%%%%%%%%%%%%%%%%'
      );
      console.debug(
        '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%'
      );

      console.debug('CLIENT:', 'Create Basis Theory Token');
      const basisTheoryToken = await bt.tokens.create({
        type: 'card',
        data: cardRef.current,
      });

      console.debug('CLIENT:', basisTheoryToken);

      console.debug('CLIENT:', 'Send to Backend /pay/stripe API');
      const payResponse = await (
        await fetch('/api/pay/stripe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: basisTheoryToken.id,
          }),
        })
      ).json();

      payResponse.logs.forEach((l: string) => console.debug('SERVER:', l));

      if (payResponse.paymentIntent.status === 'requires_confirmation') {
        setStatus('3DS verification required');
        setPaymentIntent(payResponse.paymentIntent);
      } else {
        setIsBusy(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>{'Stripe 3DS Test'}</title>
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <div id="form">
            <h1>{status}</h1>
            <CardElement id="myCard" ref={cardRef} value={testCard} />
            <button
              className={styles.setTestCardButton}
              onClick={setElementValue}
              type="button"
            >
              {'Set Test Card Value'}
            </button>
            <button
              className={styles.submitButton}
              disabled={isBusy}
              onClick={submit}
              type="button"
            >
              {'Submit'}
            </button>
          </div>
          {paymentIntent && (
            <StripeActivate3Ds
              onDone={callback3DS}
              paymentIntent={paymentIntent}
            />
          )}
        </main>
        <footer className={styles.footer}>
          <LogViewer />
        </footer>
      </div>
    </>
  );
};

export default Stripe;
