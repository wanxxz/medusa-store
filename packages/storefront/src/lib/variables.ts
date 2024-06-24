let medusaBackendURL = 'http://localhost:9000'

// server
if (typeof window === 'undefined') {
  medusaBackendURL ??= process.env.MEDUSA_BACKEND_URL as string
} else {
  // client
  medusaBackendURL ??= process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL as string
}

export { medusaBackendURL }
