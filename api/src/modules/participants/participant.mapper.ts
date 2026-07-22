import type { Participant } from '../../generated/prisma/client'

export type PublicParticipant = Omit<Participant, 'password'>

// Projeção resumida: usada quando o solicitante não pode ver dados de contato
// (visitantes ou participantes que não são donos do evento).
export type ParticipantSummary = Pick<Participant, 'id' | 'name'>

export function toPublicParticipant(
	participant: Participant,
): PublicParticipant {
	const { password: _password, ...publicParticipant } = participant
	return publicParticipant
}

export function toParticipantSummary(
	participant: Participant,
): ParticipantSummary {
	return { id: participant.id, name: participant.name }
}
