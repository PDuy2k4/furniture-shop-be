import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import express, { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { json } from 'stream/consumers'
import userSchema, { userType } from '~/models/user'
import userSerive from '~/services/user.service'
import { sendVerificationEmail } from '~/utils/mailer'

const authController = {
  //register
  register: async (req: Request, res: Response) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const newUser = new userSchema({
        ...req.body,
        password: hashedPassword
      })

      const addedUser = await userSerive.addUser(newUser)

      if (addedUser) {
        await sendVerificationEmail(newUser.email, newUser.name)
        res.status(201).json({ message: 'Please check your email' })
      } else {
        res.status(400).json({ message: 'Can not send verification to your email' })
      }
    } catch (error) {
      //error response
      res.status(500).json(error)
    }
  },

  verifyEmail: async (req: Request, res: Response) => {
    try {
      const email = req.query.email as string

      // Find user by email
      const user = await userSerive.findUserByEmail(email as string)

      if (user) {
        // Cập nhật giá trị của verifiedEmailToken
        const result = await userSerive.updateVerifiedEmailUser(user._id, 'true')

        
        if (result && result.modifiedCount > 0) {
          res.status(200).json({ message: 'Email verified successfully' })
        } else {
          res.status(400).json({ message: 'Failed to verify email' })
        }

        res.status(200).json({ message: 'Email verified successfully' })
      } else {
        res.status(400).json({ message: 'User not found' })
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

export default authController
