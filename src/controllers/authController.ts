import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import express, { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { json } from 'stream/consumers'
import userSchema, { userType } from '~/models/user'
import userSerive from '~/services/user.service'
import { sendVerificationEmail } from '~/utils/mailer'
import jwt from 'jsonwebtoken'
import authValidate from '~/validates/authValidate'
import { userVerifyStatus } from '~/constants/enum'

const authController = {
  //register
  register: async (req: Request, res: Response) => {
    try {
      const valid = await authValidate.validateRegister(req, res)
      console.log(valid)

      if (!valid) {
        return res
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
        const accessToken = jwt.sign(
          {
            _id: newUser._id,
            isAdmin: newUser.isAdmin,
            email: newUser.email
          },
          `${process.env.JWT_ACCESS_KEY}`,
          { expiresIn: '1h' }
        )
        await sendVerificationEmail(newUser.email, newUser.name, accessToken)
        console.log('Please check your email')
        res.status(201).json({ message: 'Please check your email' })
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

      if (token) {
        jwt.verify(token, `${process.env.JWT_ACCESS_KEY}`, (err: any, userToken: any) => {
          if (err) {
            res.status(403).json({ message: 'Token is not valid' })
          } else {
            userVerifyEmail = userToken.email || ''
            userVerifyId = userToken._id || ''

            console.log(userToken)

            // Use the verifiedEmail and verifiedID for further processing
            console.log('Verified Email:', userVerifyEmail)
          }
        })
      }
      if (userVerifyEmail !== '' && userVerifyId !== '') {
        console.log('Email verified successfully')
        userSerive.updateVerifiedEmailUser(userVerifyId, `${token}`, userVerifyStatus.Verified)
        return res.status(200).json({ message: 'Email verified successfully' })
      } else {
        return res.status(400).json({ message: 'User not found' })
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  logIn: async (req: Request, res: Response) => {
    try {
      const valid = await authValidate.validateLogin(req, res)

      console.log(valid)
      if (!valid) {
        return res
      }

      const user = await userSerive.findUserByEmail(req.body.email)

      const validPassword = await bcrypt.compare(req.body.password, user.password)
      res.status(200).json('Login success')
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default authController
