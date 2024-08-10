import { NextFunction, Request, Response, Router } from 'express'
import validation from '~/middlewares/validation.middleware'
import authController from '~/controllers/auth.controller'
import authMiddleware from '~/middlewares/auth.middleware'
const router = Router()

router.post('/register', validation.register, authController.register)
router.post('/sendVerifiedEmail', authMiddleware.checkValidEmail, authController.sendVerifiedEmail)
router.post('/verifyEmail', authMiddleware.checkMailToken, authController.verifiedEmail)
export default router
