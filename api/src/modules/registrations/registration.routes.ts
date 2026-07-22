import { Router } from 'express'
import { authenticate, validate } from '../../shared/middlewares'
import { registrationController } from './registration.controller'
import {
	eventParamsSchema,
	registrationParamsSchema,
} from './registration.schema'

export const registrationRoutes = Router({ mergeParams: true })

registrationRoutes.post(
	'/',
	authenticate,
	validate({ params: eventParamsSchema }),
	registrationController.register,
)

registrationRoutes.get(
	'/',
	validate({ params: eventParamsSchema }),
	registrationController.list,
)

registrationRoutes.delete(
	'/:participantId',
	authenticate,
	validate({ params: registrationParamsSchema }),
	registrationController.cancel,
)
