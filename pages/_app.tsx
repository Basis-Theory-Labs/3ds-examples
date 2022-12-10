import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {
  BasisTheoryProvider,
  useBasisTheory
} from '@basis-theory/basis-theory-react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

export default function App({ Component, pageProps }: AppProps) {
    const { bt } = useBasisTheory(process.env.NEXT_PUBLIC_BASIS_THEORY_PUBLIC, { elements: true });
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC!);

  return <Elements stripe={stripePromise}><BasisTheoryProvider bt={bt}><Component {...pageProps} /></BasisTheoryProvider></Elements>
}
