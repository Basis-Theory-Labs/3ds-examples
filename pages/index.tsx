import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {
    useBasisTheory,
} from '@basis-theory/basis-theory-react';
import type { CardElement as ICardElement } from '@basis-theory/basis-theory-react/types';
import React, {useRef, useState} from "react";
import LogViewer from "../components/logViewer";
import CardElement from "../components/cardElement";
import type {PaymentIntentResult} from "@stripe/stripe-js";
import StripeActivate3DS from "../components/stripe/stripeActivate3DS";


export default function Home() {
    const { bt } = useBasisTheory();
    const cardRef = useRef<ICardElement>(null);
    const [status, setStatus] = useState("Pay for your $20.00 fee.");
    const [activate3DS, setActivate3DS] = useState<string>("");
    const [chargedPaymentIntent, setChargedPaymentIntent] = useState<PaymentIntentResult>();

    const callback3DS = async (error_message:string): Promise<void> => {
        setActivate3DS("");
        if(error_message) {
            setStatus(error_message)
            console.debug("CLIENT", `3DS Failed with message: ${error_message}`);
            return;
        }

        console.debug("CLIENT", "Payment was successfully charged");
        setStatus("Payment successfully charged.")
    }

    const submit = async (): Promise<void> => {
        if (bt) {
                console.debug("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
                console.debug("%%%%%%%%%%%%%%%%%%%%%% STARTING PAYMENT FLOW %%%%%%%%%%%%%%%%%%%%%%");
                console.debug("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");

                console.debug("CLIENT", "Create Basis Theory Token")
                const basisTheoryToken = await bt.tokens.create({
                    type: 'card',
                    data: cardRef.current,
                });
                console.debug("CLIENT", basisTheoryToken)

                console.debug("CLIENT", "Send to Backend /pay API")
                const payResponse = await(await fetch("/api/pay", {
                    method: "POST",
                    body: JSON.stringify({
                        token: basisTheoryToken.id
                    })
                })).json()

                const {logs, chargedWith} = payResponse;
                logs.forEach((l: string) => console.debug("SERVER:", l))

                if(chargedWith === "stripe") {
                    const {paymentIntent} = payResponse.stripe;
                    if (paymentIntent.status === "requires_confirmation") {
                        setStatus("3DS verification required.")
                        setActivate3DS(chargedWith);
                        setChargedPaymentIntent(paymentIntent)
                    }
                }
        }
    };

  return (
    <div className={styles.container}>
      <Head>
        <title>Stripe 3DS Test</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <main className={styles.main}>
          <div id="form">
              <h1>{status}</h1>
              <CardElement ref={cardRef} />
              <button id="submit_button" type="button" onClick={submit}>
                  Submit
              </button>
          </div>
          {activate3DS === 'stripe' && <StripeActivate3DS paymentIntent={chargedPaymentIntent} callback={callback3DS}/>}
          <h3>👇 Logs</h3>
      </main>

      <footer className={styles.footer}>
          <LogViewer />
      </footer>
    </div>
  )
}
