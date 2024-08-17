import express, { Express, Request, Response, json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authenticate } from './middleware/authentication'
import routes from './routes/routes';
import { connectToDatabase } from './services/db';
import {configurePassport} from './services/passportConfig';
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app: Express = express()
const PORT: number = 8000

dotenv.config()
app.use(json())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);

// Express session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set true if using https
}));


connectToDatabase();

// Route to trigger OAuth login
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// OAuth callback URL
app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
