import type { NextFunction, Request, Response } from 'express'
import { ZodError, type ZodType } from 'zod'
import { ValidationError } from '../errors'

interface ValidationSchemas {
	body?: ZodType
	params?: ZodType
	query?: ZodType
}

export function validate(schemas: ValidationSchemas) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {

			if (schemas.body) req.body = schemas.body.parse(req.body)
			if (schemas.params) res.locals.params = schemas.params.parse(req.params)
			if (schemas.query) res.locals.query = schemas.query.parse(req.query)
			next()
		} catch (error) {
			if (error instanceof ZodError) {
				return next(ValidationError.fromZod(error))
			}
			next(error)
		}
	}
}
