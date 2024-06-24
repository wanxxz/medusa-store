import { requireCustomerAuthentication, type MiddlewaresConfig } from '@medusajs/medusa'

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: '/store/product-media/download/*',
      middlewares: [requireCustomerAuthentication()]
    }
  ]
}
