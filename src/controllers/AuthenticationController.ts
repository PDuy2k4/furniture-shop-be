import { Request, Response } from 'express';
import AuthenticationServiceInstance from '../services/AuthenticationService';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import ResponseMessage from '~/utils/RespondMessage';
import UserStatus from '~/utils/UserStatus';
import ValidationErrorMessage from '~/utils/ValidationMessage';
import bcrypt from 'bcrypt';
import { UserType } from '~/models/User';
import { profile } from 'console';
dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || '';

class AuthenticationController {
  async register(req: Request, res: Response) {
    try {
      console.log('Register request body:', req.body);
      const newUser: UserType = req.body;
      const hashedPassword: string = await bcrypt.hash(newUser.password, 10);
      const verifiedEmailToken = jwt.sign({ email: newUser.email }, JWT_SECRET, { expiresIn: '1d' });
      newUser.password = hashedPassword;
      newUser.verifiedEmailToken = verifiedEmailToken;
      const user = await AuthenticationServiceInstance.addUser(newUser);
      if (user) {
        //await AuthenticationServiceInstance.sendEmail(user);

        res.status(201).json({ message: ResponseMessage.SUCCESS, id: user._id });
      } else {
        res.status(400).json({ message: ResponseMessage.INTERNAL_SERVER_ERROR });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  async sendVerificationEmail(req: Request, res: Response) {
    try {
      const userId = req.body._id;
      const user = await AuthenticationServiceInstance.findUserById(userId);
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
        const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        await AuthenticationServiceInstance.updateRefreshToken(email, refreshToken);
        const { password, ...userWithoutPassword } = user;
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: ResponseMessage.SUCCESS, userWithoutPassword });
      } else {
        res.status(400).json({ message: ResponseMessage.INVALID_CREDENTIALS });
      }
    } catch (error: any) {
      res.status(400).json({ message: ResponseMessage.INTERNAL_SERVER_ERROR });
    }
  }
  async googleLogin(req: Request, res: Response) {
    try {
      console.log('Google login request body:', req.body);
      const { email } = req.body;
      let user = await AuthenticationServiceInstance.findUserByEmail(email);
      if (!user) {
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword: string = await bcrypt.hash(generatedPassword, 10);
        const newUser: UserType = {
          name: req.body.name,
          email,
          password: hashedPassword,
          status: UserStatus.ACTIVE,
          profileImg: req.body.profileImg
        };
        user = await AuthenticationServiceInstance.addUser(newUser);
        if (!user) {
          res.status(400).json({ message: ResponseMessage.INTERNAL_SERVER_ERROR });
        }
      }
      if (user) {
        const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        await AuthenticationServiceInstance.updateRefreshToken(email, refreshToken);
        const { password, ...userWithoutPassword } = user;
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: ResponseMessage.SUCCESS, userWithoutPassword });
      } else {
        res.status(400).json({ message: ResponseMessage.INTERNAL_SERVER_ERROR });
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
