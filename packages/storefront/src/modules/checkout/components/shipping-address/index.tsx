import React, { useState, useEffect, useMemo } from 'react'
import { Address, Cart, Customer } from '@medusajs/medusa'
import Checkbox from '@modules/common/components/checkbox'
import Input from '@modules/common/components/input'
import AddressSelect from '../address-select'
import CountrySelect from '../country-select'
import { Container } from '@medusajs/ui'

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
  countryCode
}: {
  customer: Omit<Customer, 'password_hash'> | null
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null
  checked: boolean
  onChange: () => void
  countryCode: string
}) => {
  const [formData, setFormData] = useState({
    'shipping_address.first_name': cart?.shipping_address?.first_name || '',
    'shipping_address.last_name': cart?.shipping_address?.last_name || '',
    'shipping_address.country_code': cart?.shipping_address?.country_code || countryCode || '',
    email: cart?.email || ''
  })

  const countriesInRegion = useMemo(() => cart?.region.countries.map(c => c.iso_2), [cart?.region])

  // check if customer has saved addresses that are in the current region
  const addressesInRegion = useMemo(
    () => customer?.shipping_addresses.filter(a => a.country_code && countriesInRegion?.includes(a.country_code)),
    [customer?.shipping_addresses, countriesInRegion]
  )

  useEffect(() => {
    setFormData({
      'shipping_address.first_name': cart?.shipping_address?.first_name || '',
      'shipping_address.last_name': cart?.shipping_address?.last_name || '',
      email: cart?.email || '',
      'shipping_address.country_code': cart?.shipping_address?.country_code || ''
    })
  }, [cart?.shipping_address, cart?.email])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      {customer && (addressesInRegion?.length || 0) > 0 && (
        <Container className="mb-6 flex flex-col gap-y-4 p-5">
          <p className="text-small-regular">
            {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
          </p>
          <AddressSelect addresses={customer.shipping_addresses} cart={cart} />
        </Container>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          name="shipping_address.first_name"
          autoComplete="given-name"
          value={formData['shipping_address.first_name']}
          onChange={handleChange}
          required
          data-testid="shipping-first-name-input"
        />
        <Input
          label="Last name"
          name="shipping_address.last_name"
          autoComplete="family-name"
          value={formData['shipping_address.last_name']}
          onChange={handleChange}
          required
          data-testid="shipping-last-name-input"
        />
        <CountrySelect
          name="shipping_address.country_code"
          autoComplete="country"
          region={cart?.region}
          value={formData['shipping_address.country_code']}
          onChange={handleChange}
          required
          data-testid="shipping-country-select"
        />
      </div>
      <div className="my-8">
        <Checkbox
          label="Billing address same as shipping address"
          name="same_as_billing"
          checked={checked}
          onChange={onChange}
          data-testid="billing-address-checkbox"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input
          label="Email"
          name="email"
          type="email"
          title="Enter a valid email address."
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
          data-testid="shipping-email-input"
        />
      </div>
    </>
  )
}

export default ShippingAddress
