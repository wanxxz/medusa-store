import { MediaType, ProductMedia } from '../models/product-media'

export type ListProductMediasRequest = {
  // no expected parameters
}

export type ListProductMediasResponse = {
  product_medias: ProductMedia[]
  count: number
}

export type CreateProductMediaRequest = {
  variant_id: string
  name: string
  file_key: string
  type?: MediaType
  mime_type: string
}

export type CreateProductMediaResponse = {
  product_media: ProductMedia
}
