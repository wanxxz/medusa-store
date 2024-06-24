import { RouteConfig } from '@medusajs/admin'
import { DocumentText } from '@medusajs/icons'
import { useAdminCustomQuery } from 'medusa-react'
import { ListProductMediasRequest, ListProductMediasResponse } from '../../../types/product-media'
import { Button, Container, Drawer, Heading, Table } from '@medusajs/ui'
import { Link } from 'react-router-dom'
import { RouteProps } from '@medusajs/admin-ui'
import ProductMediaCreateForm from '../../components/product-media/CreateForm'

const ProductMediaListPage = (props: RouteProps) => {
  const { data, isLoading } = useAdminCustomQuery<ListProductMediasRequest, ListProductMediasResponse>(
    '/product-media',
    ['product-media']
  )

  return (
    <Container>
      <div className="flex justify-between mb-4">
        <Heading level="h1">Digital Products</Heading>
        <Drawer>
          <Drawer.Trigger>
            <Button>Create</Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Create Digital Product</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <ProductMediaCreateForm {...props} />
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>
      </div>
      {isLoading && <div>Loading...</div>}
      {data && !data.product_medias.length && <div>No Digital Products</div>}
      {data && data.product_medias.length > 0 && (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Product</Table.HeaderCell>
              <Table.HeaderCell>Product Variant</Table.HeaderCell>
              <Table.HeaderCell>File Key</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.product_medias.map(product_media => (
              <Table.Row key={product_media.id}>
                <Table.Cell>{product_media.variant.product.title}</Table.Cell>
                <Table.Cell>{product_media.variant.title}</Table.Cell>
                <Table.Cell>{product_media.file_key}</Table.Cell>
                <Table.Cell>
                  <Link to={`/a/products/${product_media.variant.product_id}`}>View Product</Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export const config: RouteConfig = {
  link: {
    label: 'Digital Products',
    icon: DocumentText
  }
}

export default ProductMediaListPage
