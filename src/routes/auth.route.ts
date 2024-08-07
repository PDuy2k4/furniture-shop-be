import { NextFunction, Request, Response, Router } from 'express'
import validation from '~/middlewares/validation.middleware'
import authController from '~/controllers/auth.controller'
const router = Router()

router.post('/register', validation.register, authController.register)
router.get('/sendVerifiedEmail/:email', authController.sendVerifiedEmail)
export default router
