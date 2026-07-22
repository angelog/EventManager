import { Router } from 'express'
import { authRoutes } from './modules/auth/auth.routes'
import { eventRoutes } from './modules/events/event.routes'
import { participantRoutes } from './modules/participants/participant.routes'
import { registrationRoutes } from './modules/registrations/registration.routes'

export const router = Router()

router.get('/health', (_req, res) => {
	res.json({ status: 'ok' })
})

router.use('/auth', authRoutes)
router.use('/participants', participantRoutes)
router.use('/events', eventRoutes)
router.use('/events/:eventId/participants', registrationRoutes)
