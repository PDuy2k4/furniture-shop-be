import userService from '~/services/user.service'
import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'

/*Trùng email
    verify 2 lần email
    lỗi đăng nhập
    gmail chưa xác thực thì ko đăng nhập
    resend email nếu mail chưa qua
    resend email trường hợp đã xác thực rồi
*/

const authValidate = {
  validateRegister: async (req: Request, res: Response): Promise<boolean> => {
    try {
      const checkedUser = await userService.findUserByEmail(req.body.email)

      if (!checkedUser) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/
        if (!passwordRegex.test(req.body.password)) {
          res.status(400).json({
            message: 'Password must be at least 8 characters long, contain at least one uppercase letter and one number'
          })
          console.log(
            'Password must be at least 8 characters long, contain at least one uppercase letter and one number'
          )
          return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/        
        if (!emailRegex.test(req.body.email)) {
          res.status(400).json({
            message: 'Invalid email'
          })
          console.log(
            'Invalid email'
          )
          return false
        }
        return true
      }console.log(
        'Email already exists'
      )
      res.status(400).json({ message: 'Email already exists' })
      return false
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: 'Internal server error'
      })
      return false
    }
  },

  validateLogin: async (req: Request, res: Response) => {
    try {
      if (req.body.email === '' || req.body.password === '') {
        console.log('Please fill in your email and password')
        res.status(404).json({ message: 'Please fill in your email and password' })
        return false
      }
      const checkedUser = await userService.findUserByEmail(req.body.email)
      
      if (!checkedUser) {
        console.log('Wrong email')
        res.status(404).json({ message: 'Wrong email or password' })
        return false
      }
      const validPassword = await bcrypt.compare(req.body.password, checkedUser.password)

      if (!validPassword) {
        console.log('Wrong password')
        res.status(400).json({ message: 'Wrong email or password' })
        return false
      }

      if (checkedUser.verifiedEmailToken === '') {
        console.log('Please verify your email, remember to check in trash emails')
        res.status(404).json({ message: 'Please verify your email, remember to check in trash emails' })
        return false
      }

      return true
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal server error' })
      return false
    }
  }
}

export default authValidate
