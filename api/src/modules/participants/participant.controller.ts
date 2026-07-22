import type { Request, Response } from 'express'
import type {
	ListParticipantsQuery,
	ParticipantIdParams,
	UpdateParticipantInput,
} from './participant.schema'
import { participantService } from './participant.service'

export const participantController = {
	async list(_req: Request, res: Response) {
		const query = res.locals.query as ListParticipantsQuery
		const result = await participantService.list(query)
		res.json(result)
	},

	async getById(_req: Request, res: Response) {
		const { id } = res.locals.params as ParticipantIdParams
		const participant = await participantService.getById(id)
		res.json(participant)
	},

	async update(req: Request, res: Response) {
		const { id } = res.locals.params as ParticipantIdParams
		const input = req.body as UpdateParticipantInput
		const participant = await participantService.update(
			id,
			res.locals.participantId,
			input,
		)
		res.json(participant)
	},

	async remove(_req: Request, res: Response) {
		const { id } = res.locals.params as ParticipantIdParams
		await participantService.remove(id, res.locals.participantId)
		res.status(204).send()
	},
}
