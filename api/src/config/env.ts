import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
	DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),
	PORT: z.coerce.number().int().positive().default(3333),
	NODE_ENV: z
		.enum(['development', 'test', 'production'])
		.default('development')
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
	console.error(
		'❌ Variáveis de ambiente inválidas:',
		parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
	)
	throw new Error('Variáveis de ambiente inválidas')
}

export const env = parsed.data
