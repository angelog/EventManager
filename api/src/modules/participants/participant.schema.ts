import { z } from 'zod'
import { paginationQuerySchema } from '../../shared/http/pagination'
import { normalizePhone } from '../../shared/utils/phone'

export const participantNameSchema = z
	.string()
	.trim()
	.min(1, 'Nome é obrigatório')

export const participantEmailSchema = z
	.string()
	.trim()
	.toLowerCase()
	.email('Email inválido')

export const participantPhoneSchema = z
	.string()
	.trim()
	.transform(normalizePhone)
	.refine(
		(value) => /^\d{10,11}$/.test(value),
		'Telefone deve conter DDD + número (10 ou 11 dígitos)',
	)

export const participantPasswordSchema = z
	.string()
	.min(6, 'Senha deve ter ao menos 6 caracteres')

export const listParticipantsQuerySchema = paginationQuerySchema.extend({
	search: z.string().trim().optional(),
})

export type ListParticipantsQuery = z.infer<typeof listParticipantsQuerySchema>

export const participantIdParamsSchema = z.object({
	id: z.coerce.number().int().positive(),
})

export type ParticipantIdParams = z.infer<typeof participantIdParamsSchema>

export const updateParticipantBodySchema = z
	.object({
		name: participantNameSchema.optional(),
		email: participantEmailSchema.optional(),
		phone: participantPhoneSchema.optional(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: 'Informe ao menos um campo para atualizar',
	})

export type UpdateParticipantInput = z.infer<typeof updateParticipantBodySchema>
