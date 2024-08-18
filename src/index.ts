import express, { Express, json } from 'express'
import authRouter from './routes/auth.route'
import userRouter from './routes/user.route'
import cors from 'cors'
import { config } from 'dotenv'
config()
import databaseService from './services/database.service'
const app: Express = express()
const PORT: number = 8000

app.use(json())
app.use(
  cors({
    origin: process.env.APP_URL, // URL của frontend
    credentials: true // Cho phép gửi cookies
  })
)

databaseService.run()
app.use('/auth', authRouter)
app.use('/user', userRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
