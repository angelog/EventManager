import { prisma } from '../../shared/database/prisma'
import type { UpdateParticipantInput } from './participant.schema'

export interface CreateParticipantData {
	name: string
	email: string
	phone: string
	password: string
}

interface FindManyParams {
	skip?: number
	take?: number
	search?: string
}

export const participantRepository = {
	create(data: CreateParticipantData) {
		return prisma.participant.create({ data })
	},

	findById(id: number) {
		return prisma.participant.findUnique({ where: { id } })
	},

	findByEmail(email: string) {
		return prisma.participant.findUnique({ where: { email } })
	},

	async findManyPaginated({ skip, take, search }: FindManyParams) {
		const where = search
			? {
				OR: [
					{ name: { contains: search, mode: 'insensitive' as const } },
					{ email: { contains: search, mode: 'insensitive' as const } },
				],
			}
			: {}

		const [participants, total] = await Promise.all([
			prisma.participant.findMany({
				where,
				skip,
				take,
				orderBy: { name: 'asc' },
			}),
			prisma.participant.count({ where }),
		])

		return { participants, total }
	},

	update(id: number, data: UpdateParticipantInput) {
		return prisma.participant.update({ where: { id }, data })
	},

	delete(id: number) {
		return prisma.participant.delete({ where: { id } })
	},
}
