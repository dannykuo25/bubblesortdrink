
import React from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from "@stripe/stripe-js/pure";
import CheckoutForm from "./CheckoutForm";
const stripePromise = loadStripe('pk_test_51HtMtlDewreRBzr0BidYM1pv5K6uBwwSm9K0nyOV7Mh4rmAfjLmW7Q9YMBRqIPdkLDEFgiq6AsOtai3pCPxiGDA800VYXNaYgY');
const Payment = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);
export default Payment;