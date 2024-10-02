import express, { Express, json } from 'express'
import session from 'express-session';
import cors from 'cors'
import dotenv from 'dotenv'
import authRoute from './routes/authRoute'
import passport from 'passport'
import './utils/passportConfig'

const app: Express = express()
const PORT: number = 8000

dotenv.config() //configure env enviroment to use data from .env
app.use(json())
app.use(cors())
app.use(express.json()) //all express muse be convert to json

app.use(session({ secret: `${process.env.SESSION_SECRET}`  || 'default_secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/v1/auth', authRoute)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
