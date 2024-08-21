import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import express, { Request, response, Response } from 'express'
import { ObjectId } from 'mongodb'
import { json } from 'stream/consumers'
import userSchema, { userType } from '~/models/user'
import userSerive from '~/services/user.service'
import { sendVerificationEmail } from '~/utils/verifyMailer'
import jwt from 'jsonwebtoken'
import authValidate from '~/validates/authValidate'
import { userVerifyStatus } from '~/constants/enum'
import { sendForgotPasswordEmail } from '~/utils/forgotMailer'
import signToken from '~/utils/signToken'
import dotenv from 'dotenv'

dotenv.config()

const authController = {
  //register
  register: async (req: Request, res: Response) => {
    try {
      const validationResult = await authValidate.validateRegister(req, res)

      if (validationResult.statusCode != 200) {
        return validationResult
      }

      console.log(req.body.email + 'in controller')
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const newUser = new userSchema({
        ...req.body,
        password: hashedPassword
      })

      const addedUser = await userSerive.addUser(newUser)
      console.log(addedUser)

      if (addedUser) {
        const accessToken = signToken.signAccessToken(newUser)
        await sendVerificationEmail(newUser.email, newUser.name, accessToken)
        console.log('Please check your email')
        return res.status(201).json({ message: 'Please check your email' })
      } else {
        console.log('Can not send verification to your email')
        res.status(400).json({ message: 'Can not send verification to your email' })
      }
    } catch (error) {
      //error response
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  verifyEmail: async (req: Request, res: Response) => {
    try {
      const token = req.query.token as string
      console.log(token)

      let userVerifyEmail = ''
      let userVerifyId = ''
      let userIsAdmin = false

      if (token) {
        jwt.verify(token, `${process.env.JWT_ACCESS_KEY}`, (err: any, userToken: any) => {
          if (err) {
            return res.status(403).json({ message: 'Token is not valid' })
          } else {
            userVerifyEmail = userToken.email || ''
            userVerifyId = userToken._id || ''
            userIsAdmin = userToken.isAdmin || false

            // Use the verifiedEmail and verifiedID for further processing
            console.log('Verified Email:', userVerifyEmail)
          }
        })
      }
      if (userVerifyEmail !== '' && userVerifyId !== '') {
        console.log('Email verified successfully')
        const newRefreshToken = signToken.signRefreshToken({
          _id: userVerifyId,
          email: userVerifyEmail,
          isAdmin: userIsAdmin
        })
        userSerive.updateVerifiedEmailUser(userVerifyId, {
          verifiedEmailToken: `${token}`,
          refreshToken: `${newRefreshToken}`,
          verify: userVerifyStatus.Verified
        })
        return res.status(200).json({ message: 'Email verified successfullys' })
      } else {
        return res.status(400).json({ message: 'User not found' })
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  logIn: async (req: Request, res: Response) => {
    try {
      const validationResult = await authValidate.validateLogin(req, res)

      if (validationResult.statusCode != 200) {
        return validationResult
      }

      console.log('success')
      return res.status(200).json('Login success')
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  forgotPassword: async (req: Request, res: Response) => {
    try {
      const userFinding = await userSerive.findUserByEmail(req.body.email as string)

      if (!userFinding) {
        console.log('Email has not been registered yet')
        return res.status(404).json({ message: 'Email has not been registered yet' })
      }

      //Verfiy email link is important -> token must be lasted in 1h -> user can verify the link in 1h
      const accessToken = jwt.sign(
        {
          _id: userFinding?._id,
          isAdmin: userFinding?.isAdmin,
          email: userFinding?.email
        },
        `${process.env.JWT_ACCESS_KEY}`,
        { expiresIn: '1h' }
      )
      await sendForgotPasswordEmail(userFinding.email, userFinding.name, accessToken)
      console.log('Please check your email')
      return res.status(201).json({ message: 'Please check your email' })
    } catch (error) {
      //error response
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  verifyForgotPasswordEmail: async (req: Request, res: Response) => {
    try {
      const accessToken = req.query.token as string
      console.log(accessToken)

      if(accessToken){
        return res.redirect(`${process.env.FORGOT_PASSWORD_URL}?token=${accessToken}`)
      }
      return res.status(404).json('Invalid token')
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  updateNewPassword: async (req: Request, res: Response) => {
    try {
      const validateUpdatePassword = await authValidate.validateUpdatePassword(req, res)

      if(validateUpdatePassword.statusCode !== 200){
        return validateUpdatePassword;
      }

      const token = req.body.token as string
      console.log(token)

      let userVerifyEmail = ''
      let userVerifyId = ''
      let userIsAdmin = false

      if (token) {
        jwt.verify(token, `${process.env.JWT_ACCESS_KEY}`, (err: any, userToken: any) => {
          if (err) {
            //if the verify link lasts over 1h,  it will be invalid
            return res.status(403).json({ message: 'Token is not valid' })
          } else {
            userVerifyEmail = userToken.email || ''
            userVerifyId = userToken._id || ''
            userIsAdmin = userToken.isAdmin || false
            // Use the verifiedEmail and verifiedID for further processing
            console.log('Verified Email:', userVerifyEmail)
          }
        })
      }
      const userNewPassword = await bcrypt.hash(req.body.password, 10)
      console.log(userNewPassword)

      if (userVerifyEmail !== '' && userVerifyId !== '') {
        console.log('Email verified successfully')
        const refreshToken = signToken.signRefreshToken({ _id: userVerifyId,
          email: userVerifyEmail,
          isAdmin: userIsAdmin  })
        userSerive.updateVerifiedEmailUser(userVerifyId, {
          forgotPasswordToken: `${token}`,
          verify: userVerifyStatus.Verified,
          password: userNewPassword
        })
        console.log('update successuflly')
        return res.status(200).json({ message: 'Update password successfully' }).redirect(`${process.env.LOGIN_URL}`)
      } else {
        return res.status(400).json({ message: 'User not found' })
      }
    } catch (error) {}
  }
}

export default authController
