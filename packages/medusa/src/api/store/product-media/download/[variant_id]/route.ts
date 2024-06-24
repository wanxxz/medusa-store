import type { AbstractFileService, MedusaRequest, MedusaResponse, OrderService, ProductVariant } from '@medusajs/medusa'
import { MediaType } from '../../../../../models/product-media'
import ProductMediaService from '../../../../../services/product-media'

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const variantId = req.params.variant_id
  if (!variantId) {
    throw new Error('Variant ID is required')
  }
  const ordersService = req.scope.resolve<OrderService>('orderService')
  const orders = await ordersService.list(
    {
      customer_id: req.user.customer_id
    },
    {
      relations: ['items', 'items.variant']
    }
  )

  let variant: ProductVariant
  orders.some(order =>
    order.items.some(item => {
      if (item.variant_id === variantId) {
        variant = item.variant
        return true
      }

      return false
    })
  )

  if (!variant) {
    throw new Error("Customer hasn't purchased this product.")
  }

  // get the product media and the presigned URL
  const productMediaService = req.scope.resolve<ProductMediaService>('productMediaService')
  const productMedias = await productMediaService.list({
    type: MediaType.MAIN,
    variant_id: variant.id
  })

  const fileService = req.scope.resolve<AbstractFileService>('fileService')

  res.json({
    url: await fileService.getPresignedDownloadUrl({
      fileKey: productMedias[0].file_key,
      isPrivate: true
    }),
    name: productMedias[0].name,
    mime_type: productMedias[0].mime_type
  })
}
