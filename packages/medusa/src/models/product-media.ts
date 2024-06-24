import { BeforeInsert, Column, Entity } from 'typeorm'
import { BaseEntity, ProductVariant } from '@medusajs/medusa'
import { generateEntityId } from '@medusajs/medusa/dist/utils'

export enum MediaType {
  MAIN = 'main',
  PREVIEW = 'preview'
}

@Entity()
export class ProductMedia extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'enum', enum: MediaType, default: 'main' })
  type: MediaType

  @Column({ type: 'varchar' })
  file_key: string

  @Column({ type: 'varchar' })
  mime_type: string

  @Column({ type: 'varchar' })
  variant_id: string

  variant?: ProductVariant

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'post')
  }
}
