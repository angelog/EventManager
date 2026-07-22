import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { authHeader, createEvent, registerParticipant } from './helpers'

describe('Inscrição em evento', () => {
	describe('POST /events/:eventId/participants', () => {
		it('exige autenticação', async () => {
			const owner = await registerParticipant()
			const event = await createEvent(owner.token)

			const response = await request(app).post(
				`/events/${event.body.id}/participants`,
			)

			expect(response.status).toBe(401)
		})

		it('inscreve o participante autenticado no evento', async () => {
			const owner = await registerParticipant()
			const attendee = await registerParticipant()
			const event = await createEvent(owner.token)

			const response = await request(app)
				.post(`/events/${event.body.id}/participants`)
				.set(authHeader(attendee.token))

			expect(response.status).toBe(201)
			expect(response.body).toMatchObject({
				eventId: event.body.id,
				participantId: attendee.participant.id,
			})
		})

		it('bloqueia inscrição duplicada no mesmo evento', async () => {
			const owner = await registerParticipant()
			const attendee = await registerParticipant()
			const event = await createEvent(owner.token)

			await request(app)
				.post(`/events/${event.body.id}/participants`)
				.set(authHeader(attendee.token))

			const response = await request(app)
				.post(`/events/${event.body.id}/participants`)
				.set(authHeader(attendee.token))

			expect(response.status).toBe(409)
			expect(response.body.error).toBe('ALREADY_REGISTERED')
		})

		it('retorna 404 quando o evento não existe', async () => {
			const attendee = await registerParticipant()

			const response = await request(app)
				.post('/events/9999/participants')
				.set(authHeader(attendee.token))

			expect(response.status).toBe(404)
			expect(response.body.error).toBe('EVENT_NOT_FOUND')
		})
	})

	describe('GET /events/:eventId/participants', () => {
		it('lista os inscritos do evento (público)', async () => {
			const owner = await registerParticipant()
			const attendee = await registerParticipant()
			const event = await createEvent(owner.token)
			await request(app)
				.post(`/events/${event.body.id}/participants`)
				.set(authHeader(attendee.token))

			const response = await request(app).get(
				`/events/${event.body.id}/participants`,
			)

			expect(response.status).toBe(200)
			expect(response.body).toHaveLength(1)
			expect(response.body[0]).toMatchObject({ id: attendee.participant.id })
			expect(response.body[0]).not.toHaveProperty('password')
		})
	})

	describe('DELETE /events/:eventId/participants/:participantId', () => {
		it('permite ao próprio participante cancelar sua inscrição', async () => {
			const owner = await registerParticipant()
			const attendee = await registerParticipant()
			const event = await createEvent(owner.token)
			await request(app)
				.post(`/events/${event.body.id}/participants`)
				.set(authHeader(attendee.token))

			const response = await request(app)
				.delete(
					`/events/${event.body.id}/participants/${attendee.participant.id}`,
				)
				.set(authHeader(attendee.token))

			expect(response.status).toBe(204)
		})

		it('impede cancelar a inscrição de outro participante (sem ser dono)', async () => {
			const owner = await registerParticipant()
			const attendee = await registerParticipant()
			const intruder = await registerParticipant()
			const event = await createEvent(owner.token)
			await request(app)
				.post(`/events/${event.body.id}/participants`)
				.set(authHeader(attendee.token))

			const response = await request(app)
				.delete(
					`/events/${event.body.id}/participants/${attendee.participant.id}`,
				)
				.set(authHeader(intruder.token))

			expect(response.status).toBe(403)
		})
	})
})
