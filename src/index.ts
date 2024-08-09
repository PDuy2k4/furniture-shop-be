import express, { Express, Request, Response, json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoute from './routes/authRoute'
const app: Express = express()
const PORT: number = 8000

dotenv.config() //configure env enviroment to use data from .env
app.use(json())
app.use(cors())
app.use(express.json()) //all express muse be convert to json

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})

app.use('/v1/auth', authRoute)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
