import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { env } from '../../config/env'
import { AppError, InternalServerError, ValidationError } from '../errors'

function toAppError(error: unknown): AppError {
	if (error instanceof AppError) return error
	if (error instanceof ZodError) return ValidationError.fromZod(error)

	return new InternalServerError(
		env.NODE_ENV === 'production' ? undefined : String(error),
	)
}

export function errorHandler(
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	const appError = toAppError(error)

	if (appError.statusCode >= 500) console.error(error)

	res.status(appError.statusCode).json(appError.toResponse())
}
