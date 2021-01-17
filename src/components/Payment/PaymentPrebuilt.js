
import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from "./CheckoutForm";
const stripePromise = loadStripe('pk_test_51HtMtlDewreRBzr0BidYM1pv5K6uBwwSm9K0nyOV7Mh4rmAfjLmW7Q9YMBRqIPdkLDEFgiq6AsOtai3pCPxiGDA800VYXNaYgY');
function PaymentPrebuilt() {
  const [unit_amount, setUnit_amount] = useState(3);

  const handleClick = async (event) => {
    // Get Stripe.js instance
    const stripe = await stripePromise;

    // Call your backend to create the Checkout Session
    // TODO: post with price data using axios/fetch

    const response = await fetch('api/checkout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        unit_amount: unit_amount * 100,
        ref_code: 'abc123'
      }),
    });
    console.log(response);
    const session = await response.json();
    console.log(session);
    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId: session,

    });

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    }
  };

  return (
    <React.Fragment>
      <input type='number' defaultValue='3' onChange={e => setUnit_amount(e.target.value)}/>
      <p>{unit_amount}</p>
      <button role="link" onClick={handleClick}>
        Checkout
      </button>
    </React.Fragment>

  );
}
export default PaymentPrebuilt;