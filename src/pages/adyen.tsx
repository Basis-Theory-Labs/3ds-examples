import React, { useRef, useState } from 'react';
import { useBasisTheory } from '@basis-theory/basis-theory-react';
import Head from 'next/head';
import { AdyenActivate3Ds, CardElement, LogViewer } from '@/components';
import styles from '@/styles/Home.module.css';

const Adyen = () => {
  const { bt } = useBasisTheory();
  const cardRef = useRef(null);
  const [status, setStatus] = useState('Pay for your $20.00 fee.');
  const [isBusy, setIsBusy] = useState(false);
  const [paymentAction, setPaymentAction] = useState();

  const setElementValue = () => {
    cardRef.current?.setValue({
      number: '371449635398431',
      expiration_month: '03',
      expiration_year: '30',
      cvc: '7373',
    });
  };

  const callback3DS = async (state: any) => {
    setIsBusy(false);

    console.debug('CLIENT:', '3DS state:');
    console.debug('CLIENT:', state);

    const payResponse = await (
      await fetch('/api/pay/adyen/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          details: state.data.details,
          gateway: 'adyen',
        }),
      })
    ).json();

    const { logs, result } = payResponse;

    logs.forEach((l: string) => console.debug('SERVER:', l));
    setStatus(`Payment ${result.resultCode}`);
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
      console.debug('CLIENT:', 'Send to Backend /pay/adyen API');

      const payResponse = await (
        await fetch('/api/pay/adyen', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: basisTheoryToken.id,
          }),
        })
      ).json();

      const { logs, payment } = payResponse;

      logs.forEach((l: string) => console.debug('SERVER:', l));

      const { action, resultCode } = payment;

      if (resultCode === 'IdentifyShopper') {
        setStatus('3DS verification required.');
        setPaymentAction(action);
      } else {
        setStatus(`Payment ${resultCode}`);
        setIsBusy(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{'Adyen 3DS Test'}</title>
      </Head>

      <main className={styles.main}>
        <div id="form">
          <h1>{status}</h1>
          <CardElement id="myCard" ref={cardRef} />
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
        {paymentAction && (
          <AdyenActivate3Ds
            action={paymentAction}
            handleOnAdditionalDetails={callback3DS}
          />
        )}
      </main>
      <footer className={styles.footer}>
        <LogViewer />
      </footer>
    </div>
  );
};

export default Adyen;
