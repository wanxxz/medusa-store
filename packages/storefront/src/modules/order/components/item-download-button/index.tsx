'use client'

import { LineItem } from '@medusajs/medusa'
import { Button } from '@medusajs/ui'
import { useEffect, useState } from 'react'

type ItemProps = {
  item: Omit<LineItem, 'beforeInsert'>
}

const ItemDownloadButton = async ({ item }: ItemProps) => {
  const [fileUrl, setFileUrl] = useState('')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/download/main/${item.variant_id}`, {
      credentials: 'include'
    })
      .then(res => res.blob())
      .then(file => setFileUrl(typeof window !== 'undefined' ? window.URL.createObjectURL(file) : ''))
  }, [])

  return (
    <Button variant="secondary" asChild={true}>
      <a href={fileUrl} download={true}>
        Download
      </a>
    </Button>
  )
}

export default ItemDownloadButton
