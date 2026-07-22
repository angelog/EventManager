import { z } from 'zod'
import {
	participantEmailSchema,
	participantNameSchema,
	participantPasswordSchema,
	participantPhoneSchema,
} from '../participants/participant.schema'

export const registerBodySchema = z.object({
	name: participantNameSchema,
	email: participantEmailSchema,
	phone: participantPhoneSchema,
	password: participantPasswordSchema,
})

export type RegisterInput = z.infer<typeof registerBodySchema>

export const loginBodySchema = z.object({
	email: participantEmailSchema,
	password: z.string().min(1, 'Senha é obrigatória'),
})

export type LoginInput = z.infer<typeof loginBodySchema>
