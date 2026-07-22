import { defineConfig } from 'vitest/config'

const TEST_DATABASE_URL =
	'postgresql://postgres:postgres@localhost:5432/eventmanager_test'

export default defineConfig({
	test: {
		globalSetup: ['./test/global-setup.ts'],
		setupFiles: ['./test/setup.ts'],
		fileParallelism: false,
		env: {
			NODE_ENV: 'test',
			DATABASE_URL: TEST_DATABASE_URL,
			JWT_SECRET: 'test-secret',
			JWT_EXPIRES_IN: '7d',
		},
	},
})
