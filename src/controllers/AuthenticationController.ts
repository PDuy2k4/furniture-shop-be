import { Request, Response } from 'express';
import AuthenticationServiceInstance from '../services/AuthenticationService';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import ResponseMessage from '~/utils/RespondMessage';
import UserStatus from '~/utils/UserStatus';
import ValidationErrorMessage from '~/utils/ValidationMessage';
dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || '';

class AuthenticationController {
  async register(req: Request, res: Response) {
    try {
      console.log('Register request body:', req.body);

      const user = await AuthenticationServiceInstance.addUser(req.body);
      if (user) {
        res.status(201).json({ message: ResponseMessage.SUCCESS });
      } else {
        res.status(400).json({ message: ResponseMessage.INTERNAL_SERVER_ERROR });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  async resendVerificationEmail(req: Request, res: Response) {
    try {
      const email = req.body.email;
      const user = await AuthenticationServiceInstance.findUserByEmail(email);
      if (user) {
        if (user.status === UserStatus.PENDING) {
          await AuthenticationServiceInstance.sendEmail(user);
          res.status(200).json({ message: ResponseMessage.SUCCESS });
        } else {
          res.status(400).json({ message: ResponseMessage.USER_ALREADY_EXISTS });
        }
      } else {
        res.status(400).json({ message: ResponseMessage.USER_NOT_FOUND });
      }
    } catch (error: any) {
      res.status(400).json({ message: ResponseMessage.INTERNAL_SERVER_ERROR });
    }
  }

  async login(req: Request, res: Response) {
    try {
      console.log('Login request body:', req.body);
      const { email, password } = req.body;
      const user = await AuthenticationServiceInstance.findUserWithPassword(email, password);
      if (user) {
        res.status(200).json({ message: ResponseMessage.SUCCESS, user });
      } else {
        res.status(400).json({ message: ResponseMessage.INVALID_CREDENTIALS });
      }
    } catch (error: any) {
      res.status(400).json({ message: ResponseMessage.INTERNAL_SERVER_ERROR });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const email = req.body.email;
      const user = await AuthenticationServiceInstance.findUserByEmail(email);
      if (user) {
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });
        await AuthenticationServiceInstance.sendResetPasswordEmail(email, token);
        res.status(200).json({ message: ResponseMessage.SUCCESS });
      } else {
        res.status(400).json({ message: ResponseMessage.USER_NOT_FOUND });
      }
    } catch (error: any) {
      res.status(400).json({ message: ResponseMessage.INTERNAL_SERVER_ERROR });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, newPassword } = req.body;
      const user = await AuthenticationServiceInstance.findUserByEmail(email);
      if (user) {
        await AuthenticationServiceInstance.updateUserPassword(email, newPassword);
        await AuthenticationServiceInstance.deleteForgotPasswordToken(email);
        res.status(200).json({ message: ResponseMessage.SUCCESS });
      } else {
        res.status(400).json({ message: ResponseMessage.USER_NOT_FOUND });
      }
    } catch (error: any) {
      res.status(400).json({ message: ResponseMessage.INTERNAL_SERVER_ERROR });
    }
  }
  async verify(req: Request, res: Response) {
    try {
      const email = req.body.email;
      await AuthenticationServiceInstance.updateUserStatus(email);
      res.status(200).json({ message: 'User verified! You can login your account from now' });
    } catch (error: any) {
      res.status(400).json({ message: 'Something went wrong!' });
    }
  }
}

const AuthenticationControllerInstance = new AuthenticationController();
export default AuthenticationControllerInstance;
