import { type MedusaRequest, type MedusaResponse } from '@medusajs/medusa'
import { MediaType, type ProductMedia } from '../../../models/product-media'
import ProductMediaService from '../../../services/product-media'

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const productMediaService = req.scope.resolve<ProductMediaService>('productMediaService')
  // omitting pagination for simplicity
  const [productMedias, count] = await productMediaService.listAndCount(
    {
      type: MediaType.MAIN
    },
    {
      relations: ['variant']
    }
  )

  res.json({
    product_medias: productMedias,
    count
  })
}

export const POST = async (req: MedusaRequest<ProductMedia>, res: MedusaResponse) => {
  // validation omitted for simplicity
  const { variant_id, file_key, type = MediaType.MAIN, name, mime_type } = req.body

  const productMediaService = req.scope.resolve<ProductMediaService>('productMediaService')
  const productMedia = await productMediaService.create({
    variant_id,
    file_key,
    type,
    name,
    mime_type
  })

  res.json({
    product_media: productMedia
  })
}
