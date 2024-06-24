import { useState } from 'react'
import { MediaType } from '../../../../models/product-media'
import { useAdminCreateProduct, useAdminCustomPost, useAdminUploadProtectedFile } from 'medusa-react'
import { CreateProductMediaRequest, CreateProductMediaResponse } from '../../../../types/product-media'
import { Button, Container, Input, Label, Select } from '@medusajs/ui'
import { RouteProps } from '@medusajs/admin-ui'
import { useNavigate } from 'react-router-dom'

const ProductMediaCreateForm = ({ notify }: RouteProps) => {
  const [productName, setProductName] = useState('')
  const [productVariantName, setProductVariantName] = useState('')
  const [name, setName] = useState('')
  const [type, setType] = useState('main')
  const [file, setFile] = useState<File>()

  const createProduct = useAdminCreateProduct()
  const uploadFile = useAdminUploadProtectedFile()
  const { mutate: createDigitalProduct, isLoading } = useAdminCustomPost<
    CreateProductMediaRequest,
    CreateProductMediaResponse
  >('/product-media', ['product-media'])

  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    createProduct.mutate(
      {
        title: productName,
        is_giftcard: false,
        discountable: false,
        options: [
          {
            title: 'Digital Product'
          }
        ],
        variants: [
          {
            title: productVariantName,
            options: [
              {
                value: name // can also be the file name
              }
            ],
            // for simplicity, prices are omitted from form.
            // Those can be edited from the product's page.
            prices: []
          }
        ]
      },
      {
        onSuccess: ({ product }) => {
          // upload file
          uploadFile.mutate(file, {
            onSuccess: ({ uploads }) => {
              if (!('key' in uploads[0])) {
                return
              }
              // create the digital product
              createDigitalProduct(
                {
                  variant_id: product.variants[0].id,
                  name,
                  file_key: uploads[0].key as string,
                  type: type as MediaType,
                  mime_type: file.type
                },
                {
                  onSuccess: () => {
                    notify.success('Success', 'Digital Product Created Successfully')
                    navigate('/a/product-media')
                  }
                }
              )
            }
          })
        }
      }
    )
  }

  return (
    <Container>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <Label>Product Name</Label>
          <Input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={e => setProductName(e.target.value)}
          />
        </div>
        <div className="flex gap-4 items-center">
          <Label>Product Variant Name</Label>
          <Input
            type="text"
            placeholder="Product Variant"
            value={productVariantName}
            onChange={e => setProductVariantName(e.target.value)}
          />
        </div>
        <div className="flex gap-4 items-center">
          <Label>Media Name</Label>
          <Input type="text" placeholder="Media Name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="flex gap-4 items-center">
          <Label>Type</Label>
          <Select onValueChange={setType} value={type}>
            <Select.Trigger>
              <Select.Value placeholder="Type" />
            </Select.Trigger>
            <Select.Content className="z-50">
              <Select.Item value={'main'}>Main</Select.Item>
              <Select.Item value={'preview'}>Preview</Select.Item>
            </Select.Content>
          </Select>
        </div>
        <div className="flex gap-4 items-center">
          <Label>File</Label>
          <Input type="file" onChange={e => setFile(e.target.files[0])} />
        </div>
        <Button
          variant="primary"
          type="submit"
          isLoading={createProduct.isLoading || uploadFile.isLoading || isLoading}
        >
          Create
        </Button>
      </form>
    </Container>
  )
}

export default ProductMediaCreateForm
