import { NextFunction, Request, Response, Router } from 'express'
import validation from '~/middlewares/validation.middleware'
import authController from '~/controllers/auth.controller'
import authMiddleware from '~/middlewares/auth.middleware'
const router = Router()

router.post('/register', validation.register, authController.register)
router.post('/sendVerifiedEmail', authMiddleware.verifiedEmailToken, authController.sendVerifiedEmail)
export default router
