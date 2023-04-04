import React, { useRef, useState } from 'react';
import { useBasisTheory } from '@basis-theory/basis-theory-react';
import Head from 'next/head';
import { CardElement, LogViewer } from '@/components';
import { SpreedlyActivate3Ds } from '@/components/SpreedlyActivate3Ds';
import styles from '@/styles/Home.module.css';

const Spreedly = () => {
  const { bt } = useBasisTheory();
  const cardRef = useRef(null);
  const [status, setStatus] = useState('Pay for your $20.00 fee');
  const [isBusy, setIsBusy] = useState(false);
  const [transactionToken, setTransactionToken] = useState<string>();

  const setElementValue = () => {
    cardRef.current?.setValue({
      number: '4000000000003220',
      expiration_month: '12',
      expiration_year: '32',
      cvc: '123',
    });
  };

  const callback3DS = (paymentStatus) => {
    setIsBusy(false);
    setStatus(`Payment ${paymentStatus}`);
    console.debug('CLIENT:', `Payment ${paymentStatus}`);
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
      console.debug('CLIENT:', 'Send to Backend /pay/spreedly API');

      const payResponse = await (
        await fetch('/api/pay/spreedly', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: basisTheoryToken.id,
            browserInfo: window.Spreedly.ThreeDS.serialize(
              '05', // browser size
              'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8' // accept header
            ),
          }),
        })
      ).json();

      payResponse.logs?.forEach((l: string) => console.debug('SERVER:', l));

      setStatus('3DS verification required');
      setTransactionToken(payResponse.transactionToken); // test scenario is always 3DS challenge
    }
  };

  return (
    <>
      <Head>
        <title>{'Spreedly 3DS Test'}</title>
        <script src="https://core.spreedly.com/iframe/iframe-v1.min.js" />
      </Head>
      <div className={styles.container}>
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
          {transactionToken && (
            <SpreedlyActivate3Ds
              onDone={callback3DS}
              transactionToken={transactionToken}
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

export default Spreedly;
