'use server'

import { cookies } from 'next/headers'

import { addShippingMethod, completeCart, deleteDiscount, setPaymentSession, updateCart } from '@lib/data'
import { GiftCard, StorePostCartsCartReq } from '@medusajs/medusa'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function cartUpdate(data: StorePostCartsCartReq) {
  const cartId = cookies().get('_medusa_cart_id')?.value

  if (!cartId) return 'No cartId cookie found'

  try {
    await updateCart(cartId, data)
    revalidateTag('cart')
  } catch (error: any) {
    return error.toString()
  }
}

export async function applyDiscount(code: string) {
  const cartId = cookies().get('_medusa_cart_id')?.value

  if (!cartId) return 'No cartId cookie found'

  try {
    await updateCart(cartId, { discounts: [{ code }] }).then(() => {
      revalidateTag('cart')
    })
  } catch (error: any) {
    throw error
  }
}

export async function applyGiftCard(code: string) {
  const cartId = cookies().get('_medusa_cart_id')?.value

  if (!cartId) return 'No cartId cookie found'

  try {
    await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
      revalidateTag('cart')
    })
  } catch (error: any) {
    throw error
  }
}

export async function removeDiscount(code: string) {
  const cartId = cookies().get('_medusa_cart_id')?.value

  if (!cartId) return 'No cartId cookie found'

  try {
    await deleteDiscount(cartId, code)
    revalidateTag('cart')
  } catch (error: any) {
    throw error
  }
}

export async function removeGiftCard(codeToRemove: string, giftCards: GiftCard[]) {
  const cartId = cookies().get('_medusa_cart_id')?.value

  if (!cartId) return 'No cartId cookie found'

  try {
    await updateCart(cartId, {
      gift_cards: [...giftCards].filter(gc => gc.code !== codeToRemove).map(gc => ({ code: gc.code }))
    }).then(() => {
      revalidateTag('cart')
    })
  } catch (error: any) {
    throw error
  }
}

export async function submitDiscountForm(currentState: unknown, formData: FormData) {
  const code = formData.get('code') as string

  try {
    await applyDiscount(code).catch(async err => {
      await applyGiftCard(code)
    })
    return null
  } catch (error: any) {
    return error.toString()
  }
}

export async function setAddresses(currentState: unknown, formData: FormData) {
  if (!formData) {
    return 'No form data received'
  }

  const cartId = cookies().get('_medusa_cart_id')?.value

  if (!cartId) {
    return { message: 'No cartId cookie found' }
  }

  const data = {
    shipping_address: {
      first_name: formData.get('shipping_address.first_name'),
      last_name: formData.get('shipping_address.last_name'),
      country_code: formData.get('shipping_address.country_code')
    },
    email: formData.get('email')
  } as StorePostCartsCartReq

  const sameAsBilling = formData.get('same_as_billing')

  if (sameAsBilling === 'on') {
    data.billing_address = data.shipping_address
  }

  if (sameAsBilling !== 'on') {
    data.billing_address = {
      first_name: formData.get('billing_address.first_name'),
      last_name: formData.get('billing_address.last_name'),
      country_code: formData.get('billing_address.country_code')
    } as StorePostCartsCartReq
  }

  try {
    await updateCart(cartId, data)
    revalidateTag('cart')
  } catch (error: any) {
    return error.toString()
  }

  redirect(`/${formData.get('shipping_address.country_code')}/checkout?step=payment`)
}

export async function setShippingMethod(shippingMethodId: string) {
  const cartId = cookies().get('_medusa_cart_id')?.value

  if (!cartId) throw new Error('No cartId cookie found')

  try {
    await addShippingMethod({ cartId, shippingMethodId })
    revalidateTag('cart')
  } catch (error: any) {
    throw error
  }
}

export async function setPaymentMethod(providerId: string) {
  const cartId = cookies().get('_medusa_cart_id')?.value

  if (!cartId) throw new Error('No cartId cookie found')

  try {
    const cart = await setPaymentSession({ cartId, providerId })
    revalidateTag('cart')
    return cart
  } catch (error: any) {
    throw error
  }
}

export async function placeOrder() {
  const cartId = cookies().get('_medusa_cart_id')?.value

  if (!cartId) throw new Error('No cartId cookie found')

  let cart

  try {
    cart = await completeCart(cartId)
    revalidateTag('cart')
  } catch (error: any) {
    throw error
  }

  if (cart?.type === 'order') {
    const countryCode = cart.data.shipping_address?.country_code?.toLowerCase()
    cookies().set('_medusa_cart_id', '', { maxAge: -1 })
    redirect(`/${countryCode}/order/confirmed/${cart?.data.id}`)
  }

  return cart
}
