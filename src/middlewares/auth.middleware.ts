import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import userService from '~/services/user.service'
import { verifyToken } from '~/utils/verify'
import { config } from 'dotenv'
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
}
const authMiddleware = new AutheMiddleware()
export default authMiddleware
