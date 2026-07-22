import {
	ConflictError,
	ForbiddenError,
	NotFoundError,
} from '../../shared/errors'
import {
	buildPaginationMeta,
	paginated,
	resolvePagination,
} from '../../shared/http/pagination'
import { toPublicParticipant } from './participant.mapper'
import { participantRepository } from './participant.repository'
import type {
	ListParticipantsQuery,
	UpdateParticipantInput,
} from './participant.schema'

export const participantService = {
	async list(query: ListParticipantsQuery) {
		const resolved = resolvePagination(query)
		const { participants, total } =
			await participantRepository.findManyPaginated({
				skip: resolved.skip,
				take: resolved.take,
				search: query.search,
			})
		return paginated(
			participants.map(toPublicParticipant),
			buildPaginationMeta(total, resolved),
		)
	},

	async update(id: number, requesterId: number, input: UpdateParticipantInput) {
		if (id !== requesterId) {
			throw new ForbiddenError(
				'FORBIDDEN',
				'Você só pode alterar o próprio cadastro',
			)
		}

		const participant = await participantRepository.findById(id)
		if (!participant) {
			throw new NotFoundError(
				'PARTICIPANT_NOT_FOUND',
				'Participante não encontrado',
			)
		}

		if (input.email && input.email !== participant.email) {
			const emailOwner = await participantRepository.findByEmail(input.email)
			if (emailOwner && emailOwner.id !== id) {
				throw new ConflictError(
					'EMAIL_ALREADY_EXISTS',
					'Já existe um participante com esse email',
				)
			}
		}

		const updated = await participantRepository.update(id, input)
		return toPublicParticipant(updated)
	},

	async remove(id: number, requesterId: number) {
		if (id !== requesterId) {
			throw new ForbiddenError(
				'FORBIDDEN',
				'Você só pode remover o próprio cadastro',
			)
		}

		const participant = await participantRepository.findById(id)
		if (!participant) {
			throw new NotFoundError(
				'PARTICIPANT_NOT_FOUND',
				'Participante não encontrado',
			)
		}
		await participantRepository.delete(id)
	},
}
