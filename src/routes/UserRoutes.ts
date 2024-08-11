import { Router } from 'express';
import AuthenticationControllerInstance from '~/controllers/AuthenticationController';
import authenticationMiddleware from '~/middlewares/AuthenticationMiddleware';

const userRouter = Router();

userRouter.post('/register', authenticationMiddleware.register, AuthenticationControllerInstance.register);
userRouter.post('/login', authenticationMiddleware.login, AuthenticationControllerInstance.login);
userRouter.get(
  '/verify/:verifiedEmailToken',
  authenticationMiddleware.verifyEmail,
  AuthenticationControllerInstance.verify
);
userRouter.post(
  '/forgot-password',
  authenticationMiddleware.forgotPassword,
  AuthenticationControllerInstance.forgotPassword
);
userRouter.post(
  '/reset-password',
  authenticationMiddleware.resetPassword,
  AuthenticationControllerInstance.resetPassword
);
export default userRouter;
