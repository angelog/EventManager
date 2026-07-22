import { Router } from 'express'
import { authenticate, validate } from '../../shared/middlewares'
import { participantController } from './participant.controller'
import {
    listParticipantsQuerySchema,
    participantIdParamsSchema,
    updateParticipantBodySchema,
} from './participant.schema'

export const participantRoutes = Router()

participantRoutes.get(
    '/',
    validate({ query: listParticipantsQuerySchema }),
    participantController.list,
)

participantRoutes.get(
    '/:id',
    validate({ params: participantIdParamsSchema }),
    participantController.getById,
)

participantRoutes.put(
    '/:id',
    authenticate,
    validate({
        params: participantIdParamsSchema,
        body: updateParticipantBodySchema,
    }),
    participantController.update,
)

participantRoutes.delete(
    '/:id',
    authenticate,
    validate({ params: participantIdParamsSchema }),
    participantController.remove,
)
