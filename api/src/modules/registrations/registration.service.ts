import {
	ConflictError,
	ForbiddenError,
	NotFoundError,
} from '../../shared/errors'
import { eventRepository } from '../events/event.repository'
import {
	toParticipantSummary,
	toPublicParticipant,
} from '../participants/participant.mapper'
import { registrationRepository } from './registration.repository'

export const registrationService = {
	async register(eventId: number, participantId: number) {
		const event = await eventRepository.findById(eventId)
		if (!event) {
			throw new NotFoundError('EVENT_NOT_FOUND', 'Evento não encontrado')
		}

		const alreadyRegistered =
			await registrationRepository.findByEventAndParticipant(
				eventId,
				participantId,
			)
		if (alreadyRegistered) {
			throw new ConflictError(
				'ALREADY_REGISTERED',
				'Você já está inscrito neste evento',
			)
		}

		return registrationRepository.create(eventId, participantId)
	},

	async cancel(
		eventId: number,
		targetParticipantId: number,
		requesterId: number,
	) {
		const event = await eventRepository.findById(eventId)
		if (!event) {
			throw new NotFoundError('EVENT_NOT_FOUND', 'Evento não encontrado')
		}

		const isSelf = requesterId === targetParticipantId
		const isOwner = requesterId === event.createdById
		if (!isSelf && !isOwner) {
			throw new ForbiddenError(
				'FORBIDDEN',
				'Você não pode cancelar a inscrição de outro participante',
			)
		}

		const registration = await registrationRepository.findByEventAndParticipant(
			eventId,
			targetParticipantId,
		)
		if (!registration) {
			throw new NotFoundError(
				'REGISTRATION_NOT_FOUND',
				'Inscrição não encontrada',
			)
		}

		await registrationRepository.delete(eventId, targetParticipantId)
	},

	// `requesterId` é opcional: só o dono do evento vê os dados de contato dos
	// inscritos; visitantes e não-donos recebem apenas id e nome.
	async listParticipants(eventId: number, requesterId?: number) {
		const event = await eventRepository.findById(eventId)
		if (!event) {
			throw new NotFoundError('EVENT_NOT_FOUND', 'Evento não encontrado')
		}

		const isOwner = requesterId === event.createdById
		const registrations =
			await registrationRepository.listParticipantsByEvent(eventId)
		return registrations.map((registration) =>
			isOwner
				? toPublicParticipant(registration.participant)
				: toParticipantSummary(registration.participant),
		)
	},
}
