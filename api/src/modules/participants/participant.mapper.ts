import type { Participant } from '../../generated/prisma/client'

export type PublicParticipant = Omit<Participant, 'password'>

export function toPublicParticipant(
	participant: Participant,
): PublicParticipant {
	const { password: _password, ...publicParticipant } = participant
	return publicParticipant
}
