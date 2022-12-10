import {useEffect} from "react";
import {useStripe} from '@stripe/react-stripe-js';
import type {PaymentIntentResult} from "@stripe/stripe-js";


export default function StripeActivate3DS(params:any) {
    const { paymentIntent, callback } = params;
    const stripe = useStripe();

    useEffect(() => {
        console.debug("CLIENT", "Payment requires 3DS:")
        console.debug("CLIENT", "Show 3DS form for:")
        console.debug("CLIENT", `3DS Payment Intent:`, paymentIntent)

        const kickOff = async () => {
            const threeDSPaymentIntent: PaymentIntentResult = await stripe!.confirmCardPayment(paymentIntent.client_secret);
            console.debug("CLIENT", `Completed 3DS`);
            callback(threeDSPaymentIntent?.error?.message);
        }

        kickOff().catch();
    }, [])

    return (<span/>)
}
