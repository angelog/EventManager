import type { ZodError } from 'zod'

export interface ErrorResponse {
	error: string
	message: string
	details?: unknown
}

export class AppError extends Error {
	constructor(
		public readonly code: string,
		message: string,
		public readonly statusCode: number = 400,
		public readonly details?: unknown,
	) {
		super(message)
		this.name = this.constructor.name
	}

	toResponse(): ErrorResponse {
		return {
			error: this.code,
			message: this.message,
			...(this.details !== undefined ? { details: this.details } : {}),
		}
	}
}

export class BadRequestError extends AppError {
	constructor(code: string, message: string, details?: unknown) {
		super(code, message, 400, details)
	}
}

export class UnauthorizedError extends AppError {
	constructor(code = 'UNAUTHORIZED', message = 'Não autenticado') {
		super(code, message, 401)
	}
}

export class ForbiddenError extends AppError {
	constructor(code = 'FORBIDDEN', message = 'Acesso negado') {
		super(code, message, 403)
	}
}

export class NotFoundError extends AppError {
	constructor(code: string, message: string) {
		super(code, message, 404)
	}
}

export class ConflictError extends AppError {
	constructor(code: string, message: string) {
		super(code, message, 409)
	}
}

export class UnprocessableError extends AppError {
	constructor(code: string, message: string) {
		super(code, message, 422)
	}
}

export class ValidationError extends AppError {
	constructor(details: unknown, message = 'Dados inválidos') {
		super('VALIDATION_ERROR', message, 422, details)
	}

	static fromZod(error: ZodError): ValidationError {
		const details = error.issues.map((issue) => ({
			field: issue.path.join('.'),
			message: issue.message,
		}))
		return new ValidationError(details)
	}
}

export class InternalServerError extends AppError {
	constructor(message = 'Erro interno do servidor') {
		super('INTERNAL_SERVER_ERROR', message, 500)
	}
}
