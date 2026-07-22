import { prisma } from '../../shared/database/prisma'
import type { CreateEventInput, UpdateEventInput } from './event.schema'

interface FindManyParams {
	skip?: number
	take?: number
	search?: string
}

export const eventRepository = {
	create(data: CreateEventInput & { createdById: number }) {
		return prisma.event.create({ data })
	},

	findById(id: number) {
		return prisma.event.findUnique({ where: { id } })
	},

	findByIdWithParticipants(id: number) {
		return prisma.event.findUnique({
			where: { id },
			include: {
				createdBy: true,
				participants: {
					include: { participant: true },
					orderBy: { createdAt: 'asc' },
				},
				_count: { select: { participants: true } },
			},
		})
	},

	findByNameAndDate(name: string, date: Date) {
		return prisma.event.findFirst({ where: { name, date } })
	},

	update(id: number, data: UpdateEventInput) {
		return prisma.event.update({ where: { id }, data })
	},

	delete(id: number) {
		return prisma.event.delete({ where: { id } })
	},

	async findManyPaginatedWithCount({ skip, take, search }: FindManyParams) {
		const where = search
			? { name: { contains: search, mode: 'insensitive' as const } }
			: {}

		const [events, total] = await Promise.all([
			prisma.event.findMany({
				where,
				skip,
				take,
				orderBy: { date: 'asc' },
				include: { _count: { select: { participants: true } } },
			}),
			prisma.event.count({ where }),
		])

		return { events, total }
	},
}
