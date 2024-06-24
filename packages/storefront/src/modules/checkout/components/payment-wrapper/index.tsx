'use client'

import { Cart, PaymentSession } from '@medusajs/medusa'
import { loadStripe } from '@stripe/stripe-js'
import React from 'react'
import StripeWrapper from './stripe-wrapper'
import { createContext } from 'react'

type WrapperProps = {
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>
  children: React.ReactNode
}

export const StripeContext = createContext(false)

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

const Wrapper: React.FC<WrapperProps> = ({ cart, children }) => {
  const paymentSession = cart.payment_session as PaymentSession

  const isStripe = paymentSession?.provider_id?.includes('stripe')

  if (isStripe && paymentSession && stripePromise) {
    return (
      <StripeContext.Provider value={true}>
        <StripeWrapper paymentSession={paymentSession} stripeKey={stripeKey} stripePromise={stripePromise}>
          {children}
        </StripeWrapper>
      </StripeContext.Provider>
    )
  }

  return <div>{children}</div>
}

export default Wrapper
