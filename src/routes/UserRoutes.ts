import { Router } from 'express';
import AuthenticationControllerInstance from '~/controllers/AuthenticationController';
import authenticationMiddleware from '~/middlewares/AuthenticationMiddleware';

const userRouter = Router();

userRouter.post('/register', authenticationMiddleware.register, AuthenticationControllerInstance.register);
userRouter.post('/login', authenticationMiddleware.login, AuthenticationControllerInstance.login);
userRouter.post('/sendVerificationEmail', AuthenticationControllerInstance.sendVerificationEmail);
userRouter.post('/verify/', authenticationMiddleware.verifyEmail, AuthenticationControllerInstance.verify);
userRouter.post(
  '/forgotPassword',
  authenticationMiddleware.forgotPassword,
  AuthenticationControllerInstance.forgotPassword
);
userRouter.post(
  '/resetPassword',
  authenticationMiddleware.resetPassword,
  AuthenticationControllerInstance.resetPassword
);
userRouter.post('/googleLogin', AuthenticationControllerInstance.googleLogin);

export default userRouter;
