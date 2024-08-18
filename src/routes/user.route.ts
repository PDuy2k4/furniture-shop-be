import { NextFunction, Request, Response, Router } from 'express'
import userController from '~/controllers/user.controller'
import userMiddleware from '~/middlewares/user.middleware'
const router = Router()

router.get('/:id', userMiddleware.checkFindID, userController.getUserById)

export default router
