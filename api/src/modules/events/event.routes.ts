import { Router } from 'express'
import {
	authenticate,
	optionalAuthenticate,
	validate,
} from '../../shared/middlewares'
import { eventController } from './event.controller'
import {
	createEventBodySchema,
	eventIdParamsSchema,
	listEventsQuerySchema,
	updateEventBodySchema,
} from './event.schema'

export const eventRoutes = Router()

eventRoutes.post(
	'/',
	authenticate,
	validate({ body: createEventBodySchema }),
	eventController.create,
)

eventRoutes.get(
	'/',
	validate({ query: listEventsQuerySchema }),
	eventController.list,
)

eventRoutes.get(
	'/:eventId',
	optionalAuthenticate,
	validate({ params: eventIdParamsSchema }),
	eventController.getById,
)

eventRoutes.put(
	'/:eventId',
	authenticate,
	validate({ params: eventIdParamsSchema, body: updateEventBodySchema }),
	eventController.update,
)

eventRoutes.delete(
	'/:eventId',
	authenticate,
	validate({ params: eventIdParamsSchema }),
	eventController.remove,
)
