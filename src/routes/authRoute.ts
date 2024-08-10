import express, { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import authController from '~/controllers/authController'
import userSerive from '~/services/user.service'

//CRUD

const authRoute = express.Router()
authRoute.use(express.json())

authRoute.post('/register', authController.register)
authRoute.post('/login', authController.logIn)

authRoute.get('/verify-email', authController.verifyEmail);

export default authRoute
