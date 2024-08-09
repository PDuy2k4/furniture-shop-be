import { NextFunction, Request, Response } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import userService from '~/services/user.service'
class Validation {
  async register(req: Request, res: Response, next: NextFunction) {
    await checkSchema({
      name: {
        isString: true,
        notEmpty: true,
        errorMessage: 'Name is required',
        isLength: {
          errorMessage: 'Name should be at least 7 chars long and contain at most 50 chars',
          options: { min: 7, max: 50 }
        }
      },
      email: {
        isEmail: true,
        notEmpty: true,
        errorMessage: 'Email is required',
        custom: {
          options: async (email: string) => {
            const user = await userService.getUserByEmail(email)
            if (user) {
              throw new Error('Email already exists')
            }
          }
        }
      },
      password: {
        isString: true,
        notEmpty: true,
        errorMessage: 'Password is required',
        custom: {
          options: (password: string) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/
            if (!passwordRegex.test(password)) {
              throw new Error(
                'Password should be at least 12 chars long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol'
              )
            }
            return true
          }
        }
      },
      confirmPassword: {
        notEmpty: true,
        custom: {
          options: (confirmPassword: string, { req }) => {
            if (confirmPassword !== req.body.password) {
              throw new Error('Passwords do not match')
            }
            return true
          }
        }
      }
    }).run(req)
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.mapped() })
    }
    next()
  }
}
const validation = new Validation()
export default validation
