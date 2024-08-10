import { Request, Response } from 'express'
import userService from '~/services/user.service'
import UserSchema from '~/models/user.schema'
import dotenv from 'dotenv'
import { signToken } from '~/utils/signToken'
import { sendEmail } from '~/utils/mailer'
import { mailTemplate } from '~/constants/verifiedMailTemplate'
import { hashPassword } from '~/utils/crypto'
import { userVerifyStatus } from '~/constants/enum'
dotenv.config()
class AuthController {
  async register(req: Request, res: Response) {
    const newUser = new UserSchema(req.body)
    const hashPass = await hashPassword(newUser.password)

    newUser.password = hashPass

    try {
      await userService.addUser(newUser)
      res.status(201).json({ message: 'Register successfully', id: newUser._id })
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  }
  async sendVerifiedEmail(req: Request, res: Response) {
    const verifiedEmailToken = await signToken({
      type: 'verifiedEmail',
      payload: { _id: req.body._id, isAdmin: req.body.isAdmin }
    })
    try {
      await Promise.all([
        userService.updateUser(req.body._id, { verifiedEmailToken: verifiedEmailToken }),
        sendEmail(req.body.email, 'Verify your email', mailTemplate(verifiedEmailToken))
      ])
      res.status(201).json({ message: 'Please check your email to veriify' })
    } catch (err: any) {
      res.status(400).json({ message: `Please wait 10 minutes and try again` })
    }
  }
  async verifiedEmail(req: Request, res: Response) {
    const { _id } = req.body
    try {
      await userService.updateUser(_id, { verify: userVerifyStatus.Verified, verifiedEmailToken: '' })
      res.status(201).json({ message: 'Email is verified' })
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  }
}

const authController = new AuthController()
export default authController
