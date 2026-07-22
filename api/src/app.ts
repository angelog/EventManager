import path from 'node:path'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import { env } from './config/env'
import { router } from './routes'
import { errorHandler, notFound } from './shared/middlewares'

export const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())
if (env.NODE_ENV !== 'test') {
	app.use(morgan('dev'))
}

const openapiDocument = YAML.load(path.join(__dirname, 'docs', 'openapi.yaml'))
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument))

app.use(router)
app.use(notFound)
app.use(errorHandler)
