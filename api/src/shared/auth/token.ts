import jwt from 'jsonwebtoken'
import { env } from '../../config/env'

interface TokenPayload {
	sub: number
}

export function signToken(participantId: number): string {
	return jwt.sign(
		{ sub: participantId } satisfies TokenPayload,
		env.JWT_SECRET,
		{
			expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
		},
	)
}

export function verifyToken(token: string): number {
	const payload = jwt.verify(token, env.JWT_SECRET)
	if (typeof payload === 'string' || payload.sub === undefined) {
		throw new Error('Token payload inválido')
	}
	return Number(payload.sub)
}
