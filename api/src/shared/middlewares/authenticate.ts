import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../auth/token'
import { UnauthorizedError } from '../errors'

function extractToken(req: Request): string | null {
	const header = req.headers.authorization
	if (!header?.startsWith('Bearer ')) return null
	return header.slice('Bearer '.length).trim() || null
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
	const token = extractToken(req)
	if (!token) {
		return next(new UnauthorizedError('UNAUTHENTICATED', 'Token não fornecido'))
	}

	try {
		res.locals.participantId = verifyToken(token)
		next()
	} catch {
		next(new UnauthorizedError('INVALID_TOKEN', 'Token inválido ou expirado'))
	}
}

// Autenticação opcional: se um token válido for enviado, popula
// `res.locals.participantId`; caso contrário, segue como visitante anônimo.
// Usado em rotas públicas cujo retorno varia conforme quem está logado.
export function optionalAuthenticate(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const token = extractToken(req)
	if (!token) return next()

	try {
		res.locals.participantId = verifyToken(token)
	} catch {
		// Token inválido em rota pública é tratado como visitante anônimo.
	}
	next()
}
