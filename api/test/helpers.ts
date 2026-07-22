import request from 'supertest'
import { app } from '../src/app'

function getFutureDate(days: number): Date {
	const date = new Date();
	date.setDate(date.getDate() + days);
	return date;
}

let counter = 0

export async function registerParticipant(
	overrides: Record<string, unknown> = {},
) {
	counter++
	const credentials = {
		name: 'Participante Teste',
		email: `participant-${counter}-${Date.now()}@email.com`,
		phone: '41999999999',
		password: 'senha123',
		...overrides,
	}

	const response = await request(app).post('/auth/register').send(credentials)

	return {
		response,
		token: response.body.token as string,
		participant: response.body.participant as { id: number; email: string },
		credentials,
	}
}

export function authHeader(token: string) {
	return { Authorization: `Bearer ${token}` }
}

export function createEvent(
	token: string,
	overrides: Record<string, unknown> = {},
) {
	return request(app)
		.post('/events')
		.set(authHeader(token))
		.send({ name: 'Evento de Teste', date: getFutureDate(30), ...overrides })
}
