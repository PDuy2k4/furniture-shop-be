import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import userService from '~/services/user.service'
class UserMiddleware {
  async checkFindID(req: Request, res: Response, next: NextFunction) {
    try {
      new ObjectId(req.params.id)
    } catch (error) {
      return res.status(400).json({ message: 'Invalid ID' })
    }
    const user = await userService.getUserByID(new ObjectId(req.params.id))
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }
    req.body.user = user
    next()
  }
}

const userMiddleware = new UserMiddleware()
export default userMiddleware
