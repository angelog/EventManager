import { z } from 'zod'
import { paginationQuerySchema } from '../../shared/http/pagination'

export const createEventBodySchema = z.object({
	name: z.string().trim().min(1, 'Nome é obrigatório'),
	description: z.string().trim().min(1).optional(),
	date: z.coerce.date({ message: 'Data inválida' }),
})

export type CreateEventInput = z.infer<typeof createEventBodySchema>

export const listEventsQuerySchema = paginationQuerySchema.extend({
	search: z.string().trim().optional(),
})

export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>

export const eventIdParamsSchema = z.object({
	eventId: z.coerce.number().int().positive(),
})

export type EventIdParams = z.infer<typeof eventIdParamsSchema>

export const updateEventBodySchema = createEventBodySchema
	.partial()
	.refine((data) => Object.keys(data).length > 0, {
		message: 'Informe ao menos um campo para atualizar',
	})

export type UpdateEventInput = z.infer<typeof updateEventBodySchema>
