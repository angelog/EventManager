import { afterAll, beforeEach } from 'vitest'
import { prisma } from '../src/shared/database/prisma'

beforeEach(async () => {
	await prisma.$executeRawUnsafe(
		'TRUNCATE TABLE "event_participants", "events", "participants" RESTART IDENTITY CASCADE',
	)
})

afterAll(async () => {
	await prisma.$disconnect()
})
