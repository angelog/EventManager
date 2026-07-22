import type { Request, Response } from 'express'
import type {
	EventIdParams,
	ListEventsQuery,
	UpdateEventInput,
} from './event.schema'
import { eventService } from './event.service'

// Camada HTTP: lê a entrada já validada, delega ao service e devolve a resposta.
// Erros lançados nos services são propagados automaticamente pelo Express 5
// (async) até o errorHandler central — por isso não há try/catch aqui.
export const eventController = {
	async create(req: Request, res: Response) {
		const event = await eventService.create(req.body, res.locals.participantId)
		res.status(201).json(event)
	},

	async list(_req: Request, res: Response) {
		// query validada/coeragida foi colocada em res.locals pelo middleware validate.
		const query = res.locals.query as ListEventsQuery
		const result = await eventService.list(query)
		res.json(result)
	},

	async getById(_req: Request, res: Response) {
		const { eventId } = res.locals.params as EventIdParams
		const event = await eventService.getById(eventId)
		res.json(event)
	},

	async update(req: Request, res: Response) {
		const { eventId } = res.locals.params as EventIdParams
		const input = req.body as UpdateEventInput
		const event = await eventService.update(
			eventId,
			input,
			res.locals.participantId,
		)
		res.json(event)
	},

	async remove(_req: Request, res: Response) {
		const { eventId } = res.locals.params as EventIdParams
		await eventService.remove(eventId, res.locals.participantId)
		res.status(204).send()
	},
}
