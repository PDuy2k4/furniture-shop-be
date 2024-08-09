import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import userService from '~/services/user.service'

class AutheMiddleware {
  async verifiedEmailToken(req: Request, res: Response, next: NextFunction) {
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
}
const authMiddleware = new AutheMiddleware()
export default authMiddleware
