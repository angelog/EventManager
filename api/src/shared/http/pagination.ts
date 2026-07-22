import { z } from 'zod'

export const paginationQuerySchema = z.object({
	page: z.coerce.number().int().min(1).optional(),
	limit: z.coerce.number().int().min(1).max(100).optional(),
})

export type PaginationQuery = z.infer<typeof paginationQuerySchema>

export interface PaginationMeta {
	page: number
	limit: number
	total: number
	totalPages: number
}

export interface ResolvedPagination {
	paginate: boolean
	page: number
	limit: number
	skip?: number
	take?: number
}

export function resolvePagination({
	page,
	limit,
}: PaginationQuery): ResolvedPagination {
	const paginate = page !== undefined || limit !== undefined
	const effectivePage = page ?? 1
	const effectiveLimit = limit ?? 10

	if (!paginate) {
		return { paginate, page: effectivePage, limit: effectiveLimit }
	}

	return {
		paginate,
		page: effectivePage,
		limit: effectiveLimit,
		skip: (effectivePage - 1) * effectiveLimit,
		take: effectiveLimit,
	}
}

export function buildPaginationMeta(
	total: number,
	resolved: ResolvedPagination,
): PaginationMeta {
	if (!resolved.paginate) {
		return { page: 1, limit: total, total, totalPages: 1 }
	}

	return {
		page: resolved.page,
		limit: resolved.limit,
		total,
		totalPages: Math.max(1, Math.ceil(total / resolved.limit)),
	}
}

export function paginated<T>(data: T[], meta: PaginationMeta) {
	return { data, meta }
}
