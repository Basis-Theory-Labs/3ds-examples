import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/Home.module.css';

interface Props {
  onDone: (paymentStatus: string) => unknown;
  transactionToken: string;
}

declare global {
  interface Window {
    Spreedly: any;
  }
}

export const SpreedlyActivate3Ds = ({ onDone, transactionToken }: Props) => {
  const started = useRef(false);
  const [action, setAction] = useState<string>();

  const on3dsStatusUpdates = (threeDsStatusEvent: { action: string }) => {
    setAction(threeDsStatusEvent.action);

    if (threeDsStatusEvent.action === 'succeeded') {
      onDone('Authorized');
    } else if (threeDsStatusEvent.action === 'challenge') {
      console.debug('CLIENT:', 'Payment requires 3DS.');
      console.debug('CLIENT:', 'Show 3DS form for Transaction Token:');
      console.debug('CLIENT:', transactionToken);
      // show the challenge-modal
    } else {
      onDone('Refused');
    }
  };

  const kickoff = () => {
    const lifecycle = new window.Spreedly.ThreeDS.Lifecycle({
      environmentKey: process.env.NEXT_PUBLIC_SPREEDLY_ENVIRONMENT_KEY,
      hiddenIframeLocation: 'device-fingerprint',
      challengeIframeLocation: 'challenge',
      transactionToken,
      challengeIframeClasses: styles.spreedlyIframe,
    });

    window.Spreedly.on('3ds:status', on3dsStatusUpdates);

    lifecycle.start();
  };

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      kickoff();
    }
    // this code should run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div id="device-fingerprint" style={{ display: 'none' }} />
      <div
        id="challenge-modal"
        style={{ display: action === 'challenge' ? 'initial' : 'none' }}
      >
        <div id="challenge" />
      </div>
    </>
  );
};
