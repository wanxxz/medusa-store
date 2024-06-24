const dotenv = require('dotenv')

let ENV_FILE_NAME = ''
switch (process.env.NODE_ENV) {
  case 'production':
    ENV_FILE_NAME = '.env.production'
    break
  case 'staging':
    ENV_FILE_NAME = '.env.staging'
    break
  case 'test':
    ENV_FILE_NAME = '.env.test'
    break
  case 'development':
  default:
    ENV_FILE_NAME = '.env'
    break
}

try {
  dotenv.config({ path: process.cwd() + '/' + ENV_FILE_NAME })
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS || 'http://localhost:7000,http://localhost:7001'

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || 'http://localhost:8000'

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost/medusa-starter-default'

const MEDUSA_ADMIN_BACKEND_URL = process.env.MEDUSA_ADMIN_BACKEND_URL || 'http://localhost:9000'

const plugins = [
  `medusa-fulfillment-manual`,
  {
    resolve: 'medusa-payment-stripe',
    options: {
      api_key: process.env.STRIPE_API_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET
    }
  },
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: 'uploads'
    }
  },
  {
    resolve: '@medusajs/admin',
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      serve: process.env.NODE_ENV === 'production',
      backend: MEDUSA_ADMIN_BACKEND_URL,
      autoRebuild: true,
      develop: {
        open: 'false',
        host: '0.0.0.0',
        allowedHosts: 'all'
      }
    }
  }
]

const modules = {
  eventBus: {
    resolve: '@medusajs/event-bus-local'
  },
  cacheService: {
    resolve: '@medusajs/cache-inmemory'
  }
}

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwt_secret: process.env.JWT_SECRET || 'supersecret',
  cookie_secret: process.env.COOKIE_SECRET || 'supersecret',
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS
}

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules
}
