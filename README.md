# 3DS Examples

This repository contains 3DS implementation examples using different gateways. It aims to exemplify how to integrate [Basis Theory Elements](https://developers.basistheory.com/docs/sdks/web/react/) card capture with your 3DS implemenation of choosing.

![example.gif](./images/example.gif)

## Getting Started

1. Set up the `.env.local`
    ```bash
    cp .env.local.example .env.local
    ```
2. Install dependencies
    ```bash
    npm install
    # or
    yarn install
    ```
3. Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Test Cards

- [Stripe](https://stripe.com/docs/payments/3d-secure#three-ds-cards)
- [Adyen](https://docs.adyen.com/development-resources/testing/test-card-numbers#test-3d-secure-2-authentication)
- [Spreedly](https://docs.spreedly.com/reference/test-data/)
