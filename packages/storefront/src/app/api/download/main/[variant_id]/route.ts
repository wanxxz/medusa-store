import { medusaBackendURL } from '@lib/variables'
import { getMedusaHeaders } from 'lib/data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Record<string, any> }) {
  // Get the variant ID from the URL
  const { variant_id } = params

  // Define the API URL
  const apiUrl = `${medusaBackendURL}/store/product-media/download/${variant_id}`

  // Fetch the file data
  const { url, name, mime_type } = await fetch(apiUrl, {
    headers: getMedusaHeaders(['customer'])
  }).then(res => res.json())

  // Handle the case where the file doesn't exist
  // or the customer didn't purchase the product
  if (!url) {
    return new NextResponse("File doesn't exist", { status: 401 })
  }

  // Fetch the file
  const fileResponse = await fetch(url)

  // Handle the case where the file could not be fetched
  if (!fileResponse.ok) {
    return new NextResponse('File not found', { status: 404 })
  }

  // Get the file content as a buffer
  const fileBuffer = await fileResponse.arrayBuffer()

  // Define response headers
  const headers = {
    'Content-Type': mime_type,
    // This sets the file name for the download
    'Content-Disposition': `attachment; filename="${name}"`
  }

  // Create a NextResponse with the PDF content and headers
  const response = new NextResponse(fileBuffer, {
    status: 200,
    headers
  })

  return response
}
