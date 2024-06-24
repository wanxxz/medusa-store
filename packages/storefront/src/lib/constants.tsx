import React from 'react'
import { CreditCard } from '@medusajs/icons'

import Ideal from '@modules/common/icons/ideal'
import Bancontact from '@modules/common/icons/bancontact'

// Map of payment provider_id to their title and icon. Add in any payment providers you want to use.
export const paymentInfoMap: Record<string, { title: string; icon: React.JSX.Element }> = {
  stripe: {
    title: 'Credit card',
    icon: <CreditCard />
  },
  'stripe-ideal': {
    title: 'iDeal',
    icon: <Ideal />
  },
  'stripe-bancontact': {
    title: 'Bancontact',
    icon: <Bancontact />
  }
  // Add more payment providers here
}

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  'krw',
  'jpy',
  'vnd',
  'clp',
  'pyg',
  'xaf',
  'xof',
  'bif',
  'djf',
  'gnf',
  'kmf',
  'mga',
  'rwf',
  'xpf',
  'htg',
  'vuv',
  'xag',
  'xdr',
  'xau'
]
