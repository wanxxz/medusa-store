'use client'

import { Cart, PaymentSession } from '@medusajs/medusa'
import { Button } from '@medusajs/ui'
import { placeOrder } from '@modules/checkout/actions'
import { useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useState } from 'react'
import ErrorMessage from '../error-message'

type PaymentButtonProps = {
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>
  'data-testid': string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ cart, 'data-testid': dataTestId }) => {
  const notReady =
    !cart || !cart.shipping_address || !cart.billing_address || !cart.email || cart.shipping_methods.length < 1
      ? true
      : false

  const paidByGiftcard = cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  if (paidByGiftcard) {
    return <GiftCardPaymentButton />
  }

  const paymentSession = cart.payment_session as PaymentSession

  switch (paymentSession.provider_id) {
    case 'stripe':
      return <StripePaymentButton notReady={notReady} cart={cart} data-testid={dataTestId} />
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const GiftCardPaymentButton = () => {
  const [submitting, setSubmitting] = useState(false)

  const handleOrder = async () => {
    setSubmitting(true)
    await placeOrder()
  }

  return (
    <Button onClick={handleOrder} isLoading={submitting} data-testid="submit-order-button">
      Place order
    </Button>
  )
}

const StripePaymentButton = ({
  cart,
  notReady,
  'data-testid': dataTestId
}: {
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>
  notReady: boolean
  'data-testid'?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder().catch(() => {
      setErrorMessage('An error occurred, please try again.')
      setSubmitting(false)
    })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement('card')

  const session = cart.payment_session as PaymentSession

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name: cart.billing_address.first_name + ' ' + cart.billing_address.last_name,
            address: {
              city: cart.billing_address.city ?? undefined,
              country: cart.billing_address.country_code ?? undefined,
              line1: cart.billing_address.address_1 ?? undefined,
              line2: cart.billing_address.address_2 ?? undefined,
              postal_code: cart.billing_address.postal_code ?? undefined,
              state: cart.billing_address.province ?? undefined
            },
            email: cart.email,
            phone: cart.billing_address.phone ?? undefined
          }
        }
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if ((pi && pi.status === 'requires_capture') || (pi && pi.status === 'succeeded')) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if ((paymentIntent && paymentIntent.status === 'requires_capture') || paymentIntent.status === 'succeeded') {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage error={errorMessage} data-testid="stripe-payment-error-message" />
    </>
  )
}

export default PaymentButton
