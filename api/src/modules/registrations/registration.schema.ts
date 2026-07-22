import { z } from 'zod'

// :eventId da URL. Coeragido para number.
export const eventParamsSchema = z.object({
	eventId: z.coerce.number().int().positive(),
})

export type EventParams = z.infer<typeof eventParamsSchema>

export const registrationParamsSchema = z.object({
	eventId: z.coerce.number().int().positive(),
	participantId: z.coerce.number().int().positive(),
})

export type RegistrationParams = z.infer<typeof registrationParamsSchema>
