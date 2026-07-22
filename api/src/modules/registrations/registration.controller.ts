import type { Request, Response } from 'express'
import type { EventParams, RegistrationParams } from './registration.schema'
import { registrationService } from './registration.service'

export const registrationController = {
	// Inscreve o participante autenticado no evento.
	async register(_req: Request, res: Response) {
		const { eventId } = res.locals.params as EventParams
		const registration = await registrationService.register(
			eventId,
			res.locals.participantId,
		)
		res.status(201).json(registration)
	},

	async list(_req: Request, res: Response) {
		const { eventId } = res.locals.params as EventParams
		const participants = await registrationService.listParticipants(eventId)
		res.json(participants)
	},

	async cancel(_req: Request, res: Response) {
		const { eventId, participantId } = res.locals.params as RegistrationParams
		await registrationService.cancel(
			eventId,
			participantId,
			res.locals.participantId,
		)
		res.status(204).send()
	},
}
