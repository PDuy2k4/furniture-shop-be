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
  async login(req: Request, res: Response) {
    const { _id, isAdmin } = req.body
    const accessToken = signToken({ type: 'accessToken', payload: { _id, isAdmin } })
    const refreshToken = signToken({ type: 'refreshToken', payload: { _id, isAdmin } })
    const token = await Promise.all([accessToken, refreshToken])
    await userService.updateUser(_id, { refreshToken: token[1] })
    const { password, remember, ...others } = req.body
    res.cookie('refreshToken', token[1], { httpOnly: true, sameSite: 'strict', secure: true })
    res.status(200).json({ ...others, accessToken: token[0], refreshToken: token[1] })
  }
  async logout(req: Request, res: Response) {
    await userService.updateUser(req.body._id, { refreshToken: '' })
    res.clearCookie('refreshToken')
    res.status(200).json({ message: 'Logout successfully' })
  }
  async requestRefreshToken(req: Request, res: Response) {
    const { user } = req.body
    const accessToken = signToken({ type: 'accessToken', payload: { _id: user._id, isAdmin: user.isAdmin } })
    const newRefreshToken = signToken({ type: 'refreshToken', payload: { _id: user._id, isAdmin: user.isAdmin } })
    await userService.updateUser(user._id, { refreshToken: newRefreshToken })
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'none', secure: true })
    res.status(200).json({ accessToken, refreshToken: newRefreshToken })
  }
  async googleLogin(req: Request, res: Response) {
    const { existUser } = req.body
    if (!existUser) {
      try {
        const user = req.body.user
        const newUser = new UserSchema(user)
        req.body.user = newUser
        await userService.addUser(newUser)
      } catch (err: any) {
        return res.status(400).json({ message: err.message })
      }
    }
    const accessToken = signToken({
      type: 'accessToken',
      payload: { _id: req.body.user._id, isAdmin: req.body.user.isAdmin }
    })
    const refreshToken = signToken({
      type: 'refreshToken',
      payload: { _id: req.body.user._id, isAdmin: req.body.user.isAdmin }
    })
    const token = await Promise.all([accessToken, refreshToken])
    await userService.updateUser(req.body.user._id, { refreshToken: token[1] })
    res.cookie('refreshToken', token[1], { httpOnly: true, sameSite: 'none', secure: true })
    res.redirect(`${process.env.APP_URL}/oauth?accessToken=${token[0]}&userId=${req.body.user._id}`)
  }
}

const authController = new AuthController()
export default authController
