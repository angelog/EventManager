import { z } from 'zod'
import { paginationQuerySchema } from '../../shared/http/pagination'

// Body do POST /events. Regras de FORMATO ficam aqui (Zod); regras de NEGÓCIO
// (data futura, duplicidade) ficam no service. `date` aceita string ISO e é
// coeragida para Date; se não for uma data válida, vira VALIDATION_ERROR.
export const createEventBodySchema = z.object({
	name: z.string().trim().min(1, 'Nome é obrigatório'),
	description: z.string().trim().min(1).optional(),
	date: z.coerce.date({ message: 'Data inválida' }),
})

export type CreateEventInput = z.infer<typeof createEventBodySchema>

// Query do GET /events: paginação (page/limit) + busca opcional por nome.
export const listEventsQuerySchema = paginationQuerySchema.extend({
	search: z.string().trim().optional(),
})

export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>

// :eventId da URL nas rotas de evento (get by id / update / delete).
export const eventIdParamsSchema = z.object({
	eventId: z.coerce.number().int().positive(),
})

export type EventIdParams = z.infer<typeof eventIdParamsSchema>

// Body do PUT /events/:eventId — todos os campos opcionais (atualização parcial),
// mas exige ao menos um. As mesmas regras de negócio do create valem no service.
export const updateEventBodySchema = createEventBodySchema
	.partial()
	.refine((data) => Object.keys(data).length > 0, {
		message: 'Informe ao menos um campo para atualizar',
	})

export type UpdateEventInput = z.infer<typeof updateEventBodySchema>
