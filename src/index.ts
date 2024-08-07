import express, { Express, json } from 'express'
import authRouter from './routes/auth.route'
import cors from 'cors'

import databaseService from './services/database.service'
const app: Express = express()
const PORT: number = 8000

app.use(json())
app.use(cors())

databaseService.run()
app.use('/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
