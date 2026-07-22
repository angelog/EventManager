import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { authHeader, registerParticipant } from './helpers'

describe('Autenticação', () => {
	describe('POST /auth/register', () => {
		it('cadastra um participante, normaliza o telefone e retorna token sem expor a senha', async () => {
			const { response } = await registerParticipant({
				email: 'novo@email.com',
				phone: '(41) 99999-9999',
			})

			expect(response.status).toBe(201)
			expect(response.body.token).toEqual(expect.any(String))
			expect(response.body.participant).toMatchObject({
				id: expect.any(Number),
				email: 'novo@email.com',
				phone: '41999999999',
			})
			expect(response.body.participant).not.toHaveProperty('password')
		})

		it('rejeita email duplicado', async () => {
			await registerParticipant({ email: 'dup@email.com' })
			const { response } = await registerParticipant({ email: 'dup@email.com' })

			expect(response.status).toBe(409)
			expect(response.body.error).toBe('EMAIL_ALREADY_EXISTS')
		})

		it('rejeita senha curta (validação)', async () => {
			const { response } = await registerParticipant({ password: '123' })

			expect(response.status).toBe(422)
			expect(response.body.error).toBe('VALIDATION_ERROR')
		})
	})

	describe('POST /auth/login', () => {
		it('autentica com credenciais válidas', async () => {
			const { credentials } = await registerParticipant()

			const response = await request(app).post('/auth/login').send({
				email: credentials.email,
				password: credentials.password,
			})

			expect(response.status).toBe(200)
			expect(response.body.token).toEqual(expect.any(String))
		})

		it('rejeita senha incorreta', async () => {
			const { credentials } = await registerParticipant()

			const response = await request(app)
				.post('/auth/login')
				.send({ email: credentials.email, password: 'errada' })

			expect(response.status).toBe(401)
			expect(response.body.error).toBe('INVALID_CREDENTIALS')
		})
	})

	describe('GET /auth/me', () => {
		it('retorna o participante autenticado', async () => {
			const { token, participant } = await registerParticipant()

			const response = await request(app).get('/auth/me').set(authHeader(token))

			expect(response.status).toBe(200)
			expect(response.body).toMatchObject({ id: participant.id })
			expect(response.body).not.toHaveProperty('password')
		})

		it('retorna 401 sem token', async () => {
			const response = await request(app).get('/auth/me')

			expect(response.status).toBe(401)
		})
	})
})
