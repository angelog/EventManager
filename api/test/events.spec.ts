import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '../src/app'
import {
	authHeader,
	createEvent,
	getFutureDate,
	registerParticipant,
} from './helpers'

describe('Eventos', () => {
	describe('POST /events', () => {
		it('exige autenticação', async () => {
			const response = await request(app)
				.post('/events')
				.send({ name: 'Sem token', date: getFutureDate(30) })

			expect(response.status).toBe(401)
		})

		it('cadastra um evento para o participante autenticado', async () => {
			const { token, participant } = await registerParticipant()

			const response = await createEvent(token, { name: 'Tech Conf' })

			expect(response.status).toBe(201)
			expect(response.body).toMatchObject({
				id: expect.any(Number),
				name: 'Tech Conf',
				createdById: participant.id,
			})
		})

		it('rejeita evento com data no passado', async () => {
			const { token } = await registerParticipant()

			const response = await createEvent(token, {
				date: '2000-01-01T10:00:00.000Z',
			})

			expect(response.status).toBe(422)
			expect(response.body.error).toBe('EVENT_DATE_MUST_BE_FUTURE')
		})

		it('rejeita evento duplicado (mesmo nome e data)', async () => {
			const { token } = await registerParticipant()
			const event = { name: 'Repitido', date: getFutureDate(30) }
			await createEvent(token, event)

			const response = await createEvent(token, event)

			expect(response.status).toBe(409)
			expect(response.body.error).toBe('EVENT_ALREADY_EXISTS')
		})
	})

	describe('GET /events', () => {
		it('lista eventos paginados com a contagem de inscritos (público)', async () => {
			const { token } = await registerParticipant()
			await createEvent(token, { name: 'Evento A' })
			await createEvent(token, { name: 'Evento B' })

			const response = await request(app).get('/events?page=1&limit=10')

			expect(response.status).toBe(200)
			expect(response.body.data).toHaveLength(2)
			expect(response.body.data[0]).toHaveProperty('participantsCount', 0)
			expect(response.body.meta).toMatchObject({ total: 2, totalPages: 1 })
		})

		it('sem page/limit na query, retorna todos os eventos', async () => {
			const { token } = await registerParticipant()
			await createEvent(token, { name: 'Evento 1' })
			await createEvent(token, { name: 'Evento 2' })
			await createEvent(token, { name: 'Evento 3' })

			const response = await request(app).get('/events')

			expect(response.status).toBe(200)
			expect(response.body.data).toHaveLength(3)
			expect(response.body.meta).toMatchObject({ total: 3, totalPages: 1 })
		})

		it('filtra eventos por nome', async () => {
			const { token } = await registerParticipant()
			await createEvent(token, { name: 'React Summit' })
			await createEvent(token, { name: 'Node Congress' })

			const response = await request(app).get('/events?search=react')

			expect(response.body.data).toHaveLength(1)
			expect(response.body.data[0].name).toBe('React Summit')
		})
	})

	describe('GET /events/:eventId', () => {
		it('oculta o contato do organizador e dos inscritos para não-donos', async () => {
			const owner = await registerParticipant()
			const attendee = await registerParticipant()
			const event = await createEvent(owner.token)
			await request(app)
				.post(`/events/${event.body.id}/participants`)
				.set(authHeader(attendee.token))

			const response = await request(app).get(`/events/${event.body.id}`)

			expect(response.status).toBe(200)
			expect(response.body.createdBy).not.toHaveProperty('email')
			expect(response.body.participants[0]).toMatchObject({
				id: attendee.participant.id,
			})
			expect(response.body.participants[0]).not.toHaveProperty('email')
		})

		it('expõe os contatos quando o dono acessa o próprio evento', async () => {
			const owner = await registerParticipant()
			const attendee = await registerParticipant()
			const event = await createEvent(owner.token)
			await request(app)
				.post(`/events/${event.body.id}/participants`)
				.set(authHeader(attendee.token))

			const response = await request(app)
				.get(`/events/${event.body.id}`)
				.set(authHeader(owner.token))

			expect(response.status).toBe(200)
			expect(response.body.createdBy).toHaveProperty('email')
			expect(response.body.participants[0]).toMatchObject({
				email: attendee.participant.email,
			})
		})
	})

	describe('Permissão de dono', () => {
		it('impede que outro participante edite um evento que não é dele', async () => {
			const owner = await registerParticipant()
			const other = await registerParticipant()
			const event = await createEvent(owner.token, { name: 'Do Dono' })

			const response = await request(app)
				.put(`/events/${event.body.id}`)
				.set(authHeader(other.token))
				.send({ name: 'Invadido' })

			expect(response.status).toBe(403)
			expect(response.body.error).toBe('NOT_EVENT_OWNER')
		})

		it('permite que o dono edite o próprio evento', async () => {
			const { token } = await registerParticipant()
			const event = await createEvent(token, { name: 'Meu Evento' })

			const response = await request(app)
				.put(`/events/${event.body.id}`)
				.set(authHeader(token))
				.send({ description: 'atualizado' })

			expect(response.status).toBe(200)
			expect(response.body.description).toBe('atualizado')
		})
	})
})
