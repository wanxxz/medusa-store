import { createPaymentSessions, getCustomer } from '@lib/data'
import { getCheckoutStep } from '@lib/util/get-checkout-step'
import Addresses from '@modules/checkout/components/addresses'
import Payment from '@modules/checkout/components/payment'
import Review from '@modules/checkout/components/review'
import { cookies } from 'next/headers'
import { CartWithCheckoutStep } from 'types/global'

export default async function CheckoutForm() {
  const cartId = cookies().get('_medusa_cart_id')?.value

  if (!cartId) {
    return null
  }

  // create payment sessions and get cart
  const cart = (await createPaymentSessions(cartId).then(cart => cart)) as CartWithCheckoutStep

  if (!cart) {
    return null
  }

  cart.checkout_step = cart && getCheckoutStep(cart)

  // get customer if logged in
  const customer = await getCustomer()

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} />
      <Payment cart={cart} />
      <Review cart={cart} />
    </div>
  )
}
