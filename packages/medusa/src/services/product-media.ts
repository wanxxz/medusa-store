import {
  FindConfig,
  ProductVariant,
  ProductVariantService,
  Selector,
  TransactionBaseService,
  buildQuery
} from '@medusajs/medusa'
import { ProductMedia } from '../models/product-media'
import { MedusaError } from '@medusajs/utils'

type InjectedDependencies = {
  productVariantService: ProductVariantService
}

class ProductMediaService extends TransactionBaseService {
  protected productVariantService_: ProductVariantService

  constructor(container: InjectedDependencies) {
    super(container)
    this.productVariantService_ = container.productVariantService
  }

  private checkVariantInRelations(relations: string[]): [string[], boolean] {
    const variantsRelationIndex = relations.indexOf('variant')
    const isVariantsEnabled = variantsRelationIndex !== -1
    if (isVariantsEnabled) {
      relations.splice(variantsRelationIndex, 1)
    }

    return [relations, isVariantsEnabled]
  }

  async listAndCount(
    selector?: Selector<ProductMedia>,
    config: FindConfig<ProductMedia> = {
      skip: 0,
      take: 20,
      relations: []
    }
  ): Promise<[ProductMedia[], number]> {
    const productMediaRepo = this.activeManager_.getRepository(ProductMedia)

    const [relations, isVariantsEnabled] = this.checkVariantInRelations(config.relations || [])

    config.relations = relations

    const query = buildQuery(selector, config)

    const [productMedias, count] = await productMediaRepo.findAndCount(query)

    if (isVariantsEnabled) {
      // retrieve product variants
      await Promise.all(
        productMedias.map(async (media, index) => {
          productMedias[index].variant = await this.retrieveVariantByMedia(media)
        })
      )
    }

    return [productMedias, count]
  }

  async list(
    selector?: Selector<ProductMedia>,
    config: FindConfig<ProductMedia> = {
      skip: 0,
      take: 20,
      relations: []
    }
  ): Promise<ProductMedia[]> {
    const [productMedias] = await this.listAndCount(selector, config)

    return productMedias
  }

  async retrieve(id: string, config?: FindConfig<ProductMedia>): Promise<ProductMedia> {
    const productMediaRepo = this.activeManager_.getRepository(ProductMedia)

    const query = buildQuery(
      {
        id
      },
      config
    )

    const productMedia = await productMediaRepo.findOne(query)

    if (!productMedia) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, 'ProductMedia was not found')
    }

    if (config.relations.includes('variant')) {
      productMedia.variant = await this.retrieveVariantByMedia(productMedia)
    }

    return productMedia
  }

  async retrieveVariantByMedia(productMedia: ProductMedia) {
    return await this.productVariantService_.retrieve(productMedia.variant_id, {
      relations: ['product']
    })
  }

  async retrieveMediasByVariant(productVariant: ProductVariant): Promise<ProductMedia[]> {
    const productMediaRepo = this.activeManager_.getRepository(ProductMedia)

    const query = buildQuery({
      variant_id: productVariant.id
    })

    const productMedias = await productMediaRepo.find(query)

    return productMedias
  }

  async create(
    data: Pick<ProductMedia, 'name' | 'file_key' | 'variant_id' | 'type' | 'mime_type'>
  ): Promise<ProductMedia> {
    return this.atomicPhase_(async manager => {
      const productMediaRepo = manager.getRepository(ProductMedia)
      const productMedia = productMediaRepo.create(data)
      const result = await productMediaRepo.save(productMedia)

      return result
    })
  }

  async update(id: string, data: Omit<Partial<ProductMedia>, 'id'>): Promise<ProductMedia> {
    return await this.atomicPhase_(async manager => {
      const productMediaRepo = manager.getRepository(ProductMedia)
      const productMedia = await this.retrieve(id)

      Object.assign(productMedia, data)

      return await productMediaRepo.save(productMedia)
    })
  }

  async delete(id: string): Promise<void> {
    return await this.atomicPhase_(async manager => {
      const productMediaRepo = manager.getRepository(ProductMedia)
      const productMedia = await this.retrieve(id)

      await productMediaRepo.remove([productMedia])
    })
  }
}

export default ProductMediaService
