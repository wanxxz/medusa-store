import Medusa from '@medusajs/medusa-js'
import { medusaBackendURL } from './variables'

export const medusaClient = new Medusa({
  baseUrl: medusaBackendURL,
  maxRetries: 3
})
