import express from 'express'
import bodyParser from 'body-parser'

import swaggerSpecs from '../../docs/swagger.json'
import { RegisterRoutes } from './routes'
import { errorHandler, notFoundHandler } from './middleware'
import logger from '@platform/logging/logger'
const swaggerUi = require('swagger-ui-express')

export const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.json())

RegisterRoutes(app)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(port, () =>
  logger.log('info', `Inventory service is running at at http://localhost:${port}`)
)
