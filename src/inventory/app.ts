import express from 'express'
import bodyParser from 'body-parser'

import { RegisterRoutes } from './routes'
import { errorHandler, notFoundHandler } from './middleware'
import logger from '@platform/logging/logger'

// ########################################################################
// controllers need to be referenced in order to get crawled by the generator
import './controllers/InventoryController'
import './controllers/OrderController'
import './controllers/ConfirmController'
import './controllers/CancelController'
import './controllers/StatusController'
import './controllers/PendingController'
// ########################################################################

const cors = require('cors')

export const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use(bodyParser.json())

RegisterRoutes(app)

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(port, () =>
  logger.log('info', `Inventory service is running at at http://localhost:${port}`)
)
