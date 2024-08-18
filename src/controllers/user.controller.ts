import { Request, Response } from 'express'
import userService from '~/services/user.service'

class UserController {
  async getUserById(req: Request, res: Response) {
    const { _id, name, email, isAdmin, profileImg, verify } = req.body.user
    res.status(200).json({ _id, name, email, isAdmin, profileImg, verify })
  }
}

const userController = new UserController()
export default userController
