import { prisma } from '../../shared/database/prisma'
import type { CreateEventInput, UpdateEventInput } from './event.schema'

interface FindManyParams {
	skip?: number
	take?: number
	search?: string
}

// Camada de acesso a dados. Encapsula as queries de domínio do Prisma —
// única parte da aplicação que conversa diretamente com o ORM.
export const eventRepository = {
	create(data: CreateEventInput & { createdById: number }) {
		return prisma.event.create({ data })
	},

	findById(id: number) {
		return prisma.event.findUnique({ where: { id } })
	},

	// Evento + dono + inscritos (usuários) + contagem, para a tela de detalhes.
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

	// Usado pela regra de "não duplicar evento por nome + data".
	findByNameAndDate(name: string, date: Date) {
		return prisma.event.findFirst({ where: { name, date } })
	},

	update(id: number, data: UpdateEventInput) {
		return prisma.event.update({ where: { id }, data })
	},

	delete(id: number) {
		return prisma.event.delete({ where: { id } })
	},

	// Lista + total, já incluindo a quantidade de inscritos (_count).
	// skip/take indefinidos (sem paginação) => retorna todos os registros.
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
