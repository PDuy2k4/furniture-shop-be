import { Request, Response } from 'express'
import userService from '~/services/user.service'
import UserSchema from '~/models/user.schema'
import dotenv from 'dotenv'
import { signToken } from '~/utils/signToken'
import { sendEmail } from '~/utils/mailer'
import { mailTemplate } from '~/constants/verifiedMailTemplate'
import { hashPassword } from '~/utils/crypto'
dotenv.config()
class AuthController {
  async register(req: Request, res: Response) {
    const newUser = new UserSchema(req.body)
    newUser.password = hashPassword(newUser.password)
    const verifiedEmailToken = await signToken({
      type: 'verifiedEmail',
      payload: { _id: newUser._id, isAdmin: newUser.isAdmin }
    })
    newUser.verifiedEmailToken = verifiedEmailToken as string
    try {
      const addUser = userService.addUser(newUser)
      const sendMail = sendEmail(newUser.email, 'Verify your email', mailTemplate(newUser.verifiedEmailToken))
      await Promise.all([addUser, sendMail])
      res.status(201).json({ message: 'Please check your email to verify' })
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  }
  async sendVerifiedEmail(req: Request, res: Response) {
    const user = await userService.getUserByEmail(req.params.email)
    if (!user) {
      return res.status(400).json({ message: 'User is not registered' })
    }

    const verifiedEmailToken = await signToken({
      type: 'verifiedEmail',
      payload: { _id: user._id, isAdmin: user.isAdmin }
    })
    try {
      await userService.updateUser(user._id, { verifiedEmailToken: verifiedEmailToken })
      await sendEmail(user.email, 'Verify your email', mailTemplate(user.verifiedEmailToken))
      res.status(201).json({ message: 'Please check your email to veriify' })
    } catch (err: any) {
      res.status(400).json({ message: `Please wait 10 minutes and try again` })
    }
  }
}

const authController = new AuthController()
export default authController
