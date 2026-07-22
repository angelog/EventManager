import { app } from './app'
import { env } from './config/env'

app.listen(env.PORT, '0.0.0.0', () => {
	console.log(`🚀 Server running on http://localhost:${env.PORT}`)
	console.log(`🗂️  Docs: http://localhost:${env.PORT}/docs`)
})
