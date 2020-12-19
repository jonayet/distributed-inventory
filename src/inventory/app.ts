import express from 'express'
import bodyParser from 'body-parser'
const swaggerUi = require('swagger-ui-express')

import swaggerSpecs from './swagger.json'
import { RegisterRoutes } from './routes'

export const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.json())
app.use('/api-specs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))
RegisterRoutes(app)

app.listen(port, () =>
  console.log(`Inventory service is running at at http://localhost:${port}`)
)