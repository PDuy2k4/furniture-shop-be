import { Request, Response, NextFunction } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ValidationErrorMessage from '~/utils/ValidationMessage';
import AuthenticationServiceInstance from '~/services/AuthenticationService';
import UserStatus from '~/utils/UserStatus';
import ResponseMessage from '~/utils/RespondMessage';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || '';
class AuthenticationMiddleware {
  async register(req: Request, res: Response, next: NextFunction) {
    await checkSchema({
      name: {
        isString: true,
        notEmpty: true,
        errorMessage: ValidationErrorMessage.REQUIRED
      },
      email: {
        notEmpty: true,
        isEmail: true,
        errorMessage: ValidationErrorMessage.INVALID_EMAIL,
        custom: {
          options: async (email: string) => {
            const user = await AuthenticationServiceInstance.findUserByEmail(email);
            if (user) {
              if (user.status === UserStatus.PENDING) {
                throw new Error(ValidationErrorMessage.EMAIL_PENDING);
              } else throw new Error(ValidationErrorMessage.EMAIL_ALREADY_EXISTS);
            }
            return true;
          }
        }
      },
      password: {
        isString: true,
        notEmpty: true,
        errorMessage: 'Password is required',
        custom: {
          options: (password: string) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
            if (!passwordRegex.test(password)) {
              throw new Error(ValidationErrorMessage.INVALID_PASSWORD);
            }
            return true;
          }
        }
      },
      confirmPassword: {
        notEmpty: true,
        custom: {
          options: (confirmPassword: string, { req }) => {
            if (confirmPassword !== req.body.password) {
              throw new Error(ValidationErrorMessage.PASSWORDS_DO_NOT_MATCH);
            }
            return true;
          }
        }
      }
    }).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  }

  async login(req: Request, res: Response, next: NextFunction) {
    await checkSchema({
      email: {
        notEmpty: true,
        isEmail: true,
        errorMessage: ValidationErrorMessage.INVALID_EMAIL
      },
      password: {
        isString: true,
        notEmpty: true,
        errorMessage: ValidationErrorMessage.REQUIRED
      }
    }).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email;
    const userStatus = await AuthenticationServiceInstance.checkUserStatus(email);
    if (userStatus) {
      if (userStatus === UserStatus.PENDING) {
        return res.status(400).json({ message: ValidationErrorMessage.EMAIL_PENDING });
      }
      next();
    } else {
      return res.status(400).json({ message: ResponseMessage.INVALID_CREDENTIALS });
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.params.verifiedEmailToken;
      if (!token) {
        return res.status(400).json({ message: 'Token is required' });
      }
      const decodedToken: any = jwt.verify(token, JWT_SECRET);
      const userEmail = decodedToken.email;
      const user = await AuthenticationServiceInstance.findUserByEmail(userEmail);
      if (!user) {
        return res.status(400).json({ message: 'User not found!' });
      }
      if (user.status === UserStatus.ACTIVE) {
        return res.status(400).json({ message: 'User already verified!' });
      }
      if (user.verifiedEmailToken !== token) {
        return res.status(400).json({ message: 'Dont fake it!' });
      }
      req.body.email = userEmail;
      next();
    } catch (error) {
      return res.status(400).json({ message: 'Invalid token' });
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    await checkSchema({
      email: {
        notEmpty: true,
        isEmail: true,
        errorMessage: ValidationErrorMessage.INVALID_EMAIL
      }
    }).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  }
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    await checkSchema({
      newPassword: {
        isString: true,
        notEmpty: true,
        errorMessage: ValidationErrorMessage.REQUIRED,
        custom: {
          options: (newPassword: string) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
            if (!passwordRegex.test(newPassword)) {
              throw new Error(ValidationErrorMessage.INVALID_PASSWORD);
            }
            return true;
          }
        }
      },
      confirmNewPassword: {
        notEmpty: true,
        errorMessage: ValidationErrorMessage.REQUIRED,
        custom: {
          options: (confirmNewPassword: string, { req }) => {
            if (confirmNewPassword !== req.body.newPassword) {
              throw new Error(ValidationErrorMessage.PASSWORDS_DO_NOT_MATCH);
            }
            return true;
          }
        }
      },

      token: {
        notEmpty: true,
        errorMessage: 'Token is required'
      }
    }).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.body;
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;
    const user = await AuthenticationServiceInstance.findUserByEmail(email);
    if (user) {
      if (user.forgotPasswordToken === token) {
        req.body.email = email;
        next();
      } else {
        return res.status(400).json({ message: ResponseMessage.INVALID_CREDENTIALS });
      }
    } else {
      return res.status(400).json({ message: ResponseMessage.USER_NOT_FOUND });
    }
  }
}

const AuthenticationMiddlewareInstance = new AuthenticationMiddleware();
export default AuthenticationMiddlewareInstance;
