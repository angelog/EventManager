import {
	ConflictError,
	ForbiddenError,
	NotFoundError,
	UnprocessableError,
} from '../../shared/errors'
import {
	buildPaginationMeta,
	paginated,
	resolvePagination,
} from '../../shared/http/pagination'
import { toPublicParticipant } from '../participants/participant.mapper'
import { eventRepository } from './event.repository'
import type {
	CreateEventInput,
	ListEventsQuery,
	UpdateEventInput,
} from './event.schema'

// Tipo de um item da listagem cru vindo do repository (com _count).
type EventWithCount = Awaited<
	ReturnType<typeof eventRepository.findManyPaginatedWithCount>
>['events'][number]

// Achata o _count do Prisma num campo simples `participantsCount`.
function toEventListItem({ _count, ...event }: EventWithCount) {
	return { ...event, participantsCount: _count.participants }
}

// Detalhe do evento: expõe os participantes inscritos + a contagem.
type EventWithParticipants = NonNullable<
	Awaited<ReturnType<typeof eventRepository.findByIdWithParticipants>>
>

function toEventDetail({
	participants,
	_count,
	createdBy,
	...event
}: EventWithParticipants) {
	return {
		...event,
		createdBy: toPublicParticipant(createdBy),
		participants: participants.map((registration) =>
			toPublicParticipant(registration.participant),
		),
		participantsCount: _count.participants,
	}
}

export const eventService = {
	async create(input: CreateEventInput, createdById: number) {
		// Regra: a data do evento deve ser futura.
		if (input.date <= new Date()) {
			throw new UnprocessableError(
				'EVENT_DATE_MUST_BE_FUTURE',
				'A data do evento deve ser futura',
			)
		}

		// Regra: não permitir evento duplicado considerando nome + data.
		// (A constraint única no banco é a garantia final contra corrida.)
		const existing = await eventRepository.findByNameAndDate(
			input.name,
			input.date,
		)
		if (existing) {
			throw new ConflictError(
				'EVENT_ALREADY_EXISTS',
				'Já existe um evento com esse nome e data',
			)
		}

		// O evento pertence a quem o criou (usuário autenticado).
		return eventRepository.create({ ...input, createdById })
	},
	// Sem page/limit na query, retorna todos os eventos (sem paginar).
	async list(query: ListEventsQuery) {
		const resolved = resolvePagination(query)
		const { events, total } = await eventRepository.findManyPaginatedWithCount({
			skip: resolved.skip,
			take: resolved.take,
			search: query.search,
		})

		return paginated(
			events.map(toEventListItem),
			buildPaginationMeta(total, resolved),
		)
	},

	async getById(id: number) {
		const event = await eventRepository.findByIdWithParticipants(id)
		if (!event) {
			throw new NotFoundError('EVENT_NOT_FOUND', 'Evento não encontrado')
		}
		return toEventDetail(event)
	},

	async update(id: number, input: UpdateEventInput, requesterId: number) {
		const event = await eventRepository.findById(id)
		if (!event) {
			throw new NotFoundError('EVENT_NOT_FOUND', 'Evento não encontrado')
		}

		// Regra: só o dono do evento pode alterá-lo.
		if (event.createdById !== requesterId) {
			throw new ForbiddenError(
				'NOT_EVENT_OWNER',
				'Apenas o criador pode alterar este evento',
			)
		}

		// Regra de data futura só se aplica quando a data está sendo alterada
		// (evita bloquear a edição do nome de um evento cuja data já passou).
		if (input.date !== undefined && input.date <= new Date()) {
			throw new UnprocessableError(
				'EVENT_DATE_MUST_BE_FUTURE',
				'A data do evento deve ser futura',
			)
		}

		// Regra: não colidir com outro evento no par (nome, data).
		const nextName = input.name ?? event.name
		const nextDate = input.date ?? event.date
		const duplicate = await eventRepository.findByNameAndDate(
			nextName,
			nextDate,
		)
		if (duplicate && duplicate.id !== id) {
			throw new ConflictError(
				'EVENT_ALREADY_EXISTS',
				'Já existe um evento com esse nome e data',
			)
		}

		return eventRepository.update(id, input)
	},

	async remove(id: number, requesterId: number) {
		const event = await eventRepository.findById(id)
		if (!event) {
			throw new NotFoundError('EVENT_NOT_FOUND', 'Evento não encontrado')
		}

		// Regra: só o dono do evento pode removê-lo.
		if (event.createdById !== requesterId) {
			throw new ForbiddenError(
				'NOT_EVENT_OWNER',
				'Apenas o criador pode remover este evento',
			)
		}

		await eventRepository.delete(id)
	},
}
