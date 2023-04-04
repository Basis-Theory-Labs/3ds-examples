import React, { ForwardedRef } from 'react';
import { CardElement as ICardElement } from '@basis-theory/basis-theory-js/types/elements';
import { CardElement } from '@basis-theory/basis-theory-react';

const CardElementWrapper = React.forwardRef(
  (params: any, ref: ForwardedRef<ICardElement>) => (
    <div className="row row-input">
      <CardElement
        id="myCard"
        ref={ref}
        style={{
          fonts: [
            'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap',
          ],
          base: {
            color: '#fff',
            fontWeight: 500,
            fontFamily: '"Inter"',
            fontSize: '16px',
            fontSmooth: 'antialiased',
            '::placeholder': {
              color: '#6b7294',
            },
            ':disabled': {
              backgroundColor: 'transparent',
            },
          },
        }}
      />
    </div>
  )
);

export { CardElementWrapper as CardElement };
