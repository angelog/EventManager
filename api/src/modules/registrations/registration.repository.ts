import { prisma } from '../../shared/database/prisma'

export const registrationRepository = {
	create(eventId: number, participantId: number) {
		return prisma.eventParticipant.create({
			data: { eventId, participantId },
		})
	},

	findByEventAndParticipant(eventId: number, participantId: number) {
		return prisma.eventParticipant.findUnique({
			where: { eventId_participantId: { eventId, participantId } },
		})
	},

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
