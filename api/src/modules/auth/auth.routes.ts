import { Router } from 'express'
import { authenticate, validate } from '../../shared/middlewares'
import { authController } from './auth.controller'
import { loginBodySchema, registerBodySchema } from './auth.schema'

export const authRoutes = Router()

authRoutes.post(
	'/register',
	validate({ body: registerBodySchema }),
	authController.register,
)

authRoutes.post(
	'/login',
	validate({ body: loginBodySchema }),
	authController.login,
)

authRoutes.get('/me', authenticate, authController.me)
