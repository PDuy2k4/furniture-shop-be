import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import userService from '~/services/user.service'
import { verifyToken } from '~/utils/verify'
import { config } from 'dotenv'
import bcrypt from 'bcrypt'
import { decodeToken } from '~/utils/decodeToken'
import generatePassword from '~/utils/generateRandomPass'
import UserSchema from '~/models/user.schema'
import { verify } from 'crypto'
config()
class AutheMiddleware {
  async checkValidEmail(req: Request, res: Response, next: NextFunction) {
    req.body._id = new ObjectId(req.body._id as string)
    const user = await userService.getUserByID(req.body._id)
    if (!user) {
      return res.status(400).json({ message: 'User is not registered' })
    } else if (user.verify) {
      return res.status(400).json({ message: 'Email is already verified' })
    }
    req.body.email = user.email
    req.body.isAdmin = user.isAdmin
    next()
  }
  async checkMailToken(req: Request, res: Response, next: NextFunction) {
    const token = req.body.token
    if (!token) {
      return res.status(400).json({ message: 'Token is required' })
    }
    try {
      const decoded = await verifyToken(token, process.env.EMAIL_SECRET_HASH as string)
      const user = await userService.getUserByID(new ObjectId(decoded._id))
      if (!user) {
        return res.status(400).json({ message: 'User is not Registered' })
      } else if (user.verify) {
        return res.status(400).json({ message: 'Email is already Verified' })
      } else if (user.verifiedEmailToken !== token) {
        return res.status(400).json({ message: 'Your token is invalid' })
      }
      req.body._id = user._id
      next()
    } catch (error) {
      return res.status(400).json({ message: 'User is not Registered' })
    }
  }
  async checkLoginUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body
    const user = await userService.getUserByEmail(email)
    if (!user) {
      return res.status(400).json({ message: 'Email is not registered' })
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Password is incorrect' })
    }
    req.body.profileImg = user.profileImg
    req.body.verify = user.verify
    req.body.name = user.name
    req.body._id = user._id
    req.body.isAdmin = user.isAdmin
    next()
  }
  async checkRefreshToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.status(400).json({ message: 'Please login' })
    }
    const decoded = await decodeToken(refreshToken, process.env.REFRESH_SECRET_HASH as string)
    if (!decoded) {
      return res.status(400).json({ message: 'Invalid token' })
    }
    const user = await userService.getUserByID(decoded._id)
    if (!user) {
      return res.status(400).json({ message: 'User is not registered' })
    }
    if (user.refreshToken !== refreshToken) {
      return res.status(400).json({ message: 'Invalid token' })
    }
    req.body.user = user._id
    next()
  }
  async CheckGoogleLoginUser(req: Request, res: Response, next: NextFunction) {
    const { code } = req.query
    try {
      const data = await userService.getOauthGoogleToken(code as string)
      const { id_token } = data
      const googleUser = await userService.getUserByGoogleToken(id_token)
      const user = await userService.getUserByEmail(googleUser?.email)
      if (!user) {
        req.body.existUser = false
        req.body.user = { ...googleUser, isAdmin: false, password: generatePassword(), verify: 1 }
      } else {
        req.body.existUser = true
        req.body.user = { ...user, verify: 1 }
      }
      next()
    } catch (err: any) {
      return res.status(400).redirect(`${process.env.APP_URL}/`)
    }
  }
}
const authMiddleware = new AutheMiddleware()
export default authMiddleware
