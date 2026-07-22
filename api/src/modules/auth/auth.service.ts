import { signToken } from '../../shared/auth/token'
import {
	ConflictError,
	NotFoundError,
	UnauthorizedError,
} from '../../shared/errors'
import { comparePassword, hashPassword } from '../../shared/utils/password'
import { toPublicParticipant } from '../participants/participant.mapper'
import { participantRepository } from '../participants/participant.repository'
import type { LoginInput, RegisterInput } from './auth.schema'

export const authService = {
	async register(input: RegisterInput) {
		// Regra: email único.
		const existing = await participantRepository.findByEmail(input.email)
		if (existing) {
			throw new ConflictError(
				'EMAIL_ALREADY_EXISTS',
				'Já existe um participante com esse email',
			)
		}

		const password = await hashPassword(input.password)
		const participant = await participantRepository.create({
			...input,
			password,
		})

		return {
			participant: toPublicParticipant(participant),
			token: signToken(participant.id),
		}
	},

	async login(input: LoginInput) {
		const participant = await participantRepository.findByEmail(input.email)
		// Mesma resposta para email inexistente ou senha errada (não vaza qual falhou).
		if (
			!participant ||
			!(await comparePassword(input.password, participant.password))
		) {
			throw new UnauthorizedError(
				'INVALID_CREDENTIALS',
				'Email ou senha inválidos',
			)
		}

		return {
			participant: toPublicParticipant(participant),
			token: signToken(participant.id),
		}
	},

	async me(participantId: number) {
		const participant = await participantRepository.findById(participantId)
		if (!participant) {
			throw new NotFoundError(
				'PARTICIPANT_NOT_FOUND',
				'Participante não encontrado',
			)
		}
		return toPublicParticipant(participant)
	},
}
