import { type LineItem, type Region } from '@medusajs/medusa'
import { Table, Text } from '@medusajs/ui'
import LineItemOptions from '@modules/common/components/line-item-options'
import LineItemPrice from '@modules/common/components/line-item-price'
import Thumbnail from '@modules/products/components/thumbnail'
import ItemDownloadButton from '../item-download-button'

type ItemProps = {
  item: Omit<LineItem, 'beforeInsert'>
  region: Region
}

const Item = async ({ item, region, ...rest }: ItemProps) => {
  console.log(rest)
  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="!pl-0 p-4 w-24">
        <div className="flex w-16">
          <Thumbnail thumbnail={item.thumbnail} size="square" />
        </div>
      </Table.Cell>
      <Table.Cell className="text-left">
        <Text className="txt-medium-plus text-ui-fg-base" data-testid="product-name">
          {item.title}
        </Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </Table.Cell>
      <Table.Cell className="!pr-0">
        <span className="!pr-0 flex flex-col items-end h-full justify-center">
          <span className="flex gap-x-1 ">
            <Text className="text-ui-fg-muted">
              <span data-testid="product-quantity">{item.quantity}</span>x{' '}
            </Text>
            <LineItemPrice item={item} region={region} style="tight" />
            <ItemDownloadButton item={item} />
          </span>
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
