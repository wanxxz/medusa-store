const { config } = require('dotenv')
const { DataSource } = require('typeorm')

config()

module.exports = {
  datasource: new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['dist/models/*.js']
  })
}
