import { NextFunction, Request, Response, Router } from 'express'
import validation from '~/middlewares/validation.middleware'
import authController from '~/controllers/auth.controller'
import authMiddleware from '~/middlewares/auth.middleware'
const router = Router()

router.post('/register', validation.register, authController.register)
router.post('/sendVerifiedEmail', authMiddleware.checkValidEmail, authController.sendVerifiedEmail)
router.post('/verifyEmail', authMiddleware.checkMailToken, authController.verifiedEmail)
router.post('/login', authMiddleware.checkLoginUser, authController.login)
router.post('/logout', authController.logout)
router.post('/refreshToken', authMiddleware.checkRefreshToken, authController.requestRefreshToken)
router.get('/oauth/google', authMiddleware.CheckGoogleLoginUser, authController.googleLogin)
export default router
