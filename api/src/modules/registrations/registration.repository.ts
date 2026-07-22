import { prisma } from '../../shared/database/prisma'

// Acesso a dados da tabela de junção event_participants (a inscrição).
export const registrationRepository = {
	create(eventId: number, participantId: number) {
		return prisma.eventParticipant.create({
			data: { eventId, participantId },
		})
	},

	// Usa a constraint única composta (eventId, participantId) para checar duplicidade.
	findByEventAndParticipant(eventId: number, participantId: number) {
		return prisma.eventParticipant.findUnique({
			where: { eventId_participantId: { eventId, participantId } },
		})
	},

	// Participantes inscritos em um evento, na ordem de inscrição.
	listParticipantsByEvent(eventId: number) {
		return prisma.eventParticipant.findMany({
			where: { eventId },
			include: { participant: true },
			orderBy: { createdAt: 'asc' },
		})
	},

	delete(eventId: number, participantId: number) {
		return prisma.eventParticipant.delete({
			where: { eventId_participantId: { eventId, participantId } },
		})
	},
}
