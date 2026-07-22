
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
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

app.use(router)
app.use(notFound)
app.use(errorHandler)