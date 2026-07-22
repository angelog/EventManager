import { execSync } from 'node:child_process'
import { Client } from 'pg'

const TEST_DATABASE_URL =
	'postgresql://postgres:postgres@localhost:5432/eventmanager_test'
const TEST_DB_NAME = 'eventmanager_test'
const ADMIN_URL = 'postgresql://postgres:postgres@localhost:5432/postgres'

async function ensureTestDatabase() {
	const admin = new Client({ connectionString: ADMIN_URL })
	await admin.connect()
	const { rowCount } = await admin.query(
		'SELECT 1 FROM pg_database WHERE datname = $1',
		[TEST_DB_NAME],
	)
	if (rowCount === 0) {
		await admin.query(`CREATE DATABASE "${TEST_DB_NAME}"`)
	}
	await admin.end()
}

export default async function setup() {
	await ensureTestDatabase()

	execSync('npx prisma migrate deploy', {
		stdio: 'inherit',
		env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
	})
}
