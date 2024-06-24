import React, { useState, useEffect } from 'react'
import Input from '@modules/common/components/input'
import CountrySelect from '../country-select'
import { Cart } from '@medusajs/medusa'

const BillingAddress = ({
  cart,
  countryCode
}: {
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null
  countryCode: string
}) => {
  const [formData, setFormData] = useState({
    'billing_address.first_name': cart?.billing_address?.first_name || '',
    'billing_address.last_name': cart?.billing_address?.last_name || '',
    'billing_address.country_code': cart?.billing_address?.country_code || countryCode || ''
  })

  useEffect(() => {
    setFormData({
      'billing_address.first_name': cart?.billing_address?.first_name || '',
      'billing_address.last_name': cart?.billing_address?.last_name || '',
      'billing_address.country_code': cart?.billing_address?.country_code || ''
    })
  }, [cart?.billing_address])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          name="billing_address.first_name"
          autoComplete="given-name"
          value={formData['billing_address.first_name']}
          onChange={handleChange}
          required
          data-testid="billing-first-name-input"
        />
        <Input
          label="Last name"
          name="billing_address.last_name"
          autoComplete="family-name"
          value={formData['billing_address.last_name']}
          onChange={handleChange}
          required
          data-testid="billing-last-name-input"
        />
        <CountrySelect
          name="billing_address.country_code"
          autoComplete="country"
          region={cart?.region}
          value={formData['billing_address.country_code']}
          onChange={handleChange}
          required
          data-testid="billing-country-select"
        />
      </div>
    </>
  )
}

export default BillingAddress
