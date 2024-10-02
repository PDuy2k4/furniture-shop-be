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
  validateRegister: async (req: Request, res: Response): Promise<any> => {
    try {
      //check valid email and password
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(req.body.email)) {
        console.log('Invalid email')
        return res.status(400).json({
          message: 'Invalid email'
        })
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/
      if (!passwordRegex.test(req.body.password)) {
        console.log('Password must be at least 8 characters long, contain at least one uppercase letter and one number')
        return res.status(400).json({
          message: 'Password must be at least 8 characters long, contain at least one uppercase letter and one number'
        })
      }

      const checkedUser = await userService.findUserByEmail(req.body.email)

      if (!checkedUser) {
        return res.status(200)
      }
      console.log('Email already exists')
      return res.status(400).json({ message: 'Email already exists' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: 'Internal server error'
      })
    }
  },

  validateLogin: async (req: Request, res: Response): Promise<any> => {
    try {
      if (req.body.email === '' || req.body.password === '') {
        console.log('Please fill in your email and password')
        return res.status(404).json({ message: 'Please fill in your email and password' })
      }
      const checkedUser = await userService.findUserByEmail(req.body.email)

      if (!checkedUser) {
        console.log('Wrong email or password')
        return res.status(404).json({ message: 'Wrong email or password' })
      }
      const validPassword = await bcrypt.compare(req.body.password, checkedUser.password)

      if (!validPassword) {
        console.log('Wrong email or password')
        return res.status(400).json({ message: 'Wrong email or password' })
      }

      if (checkedUser.verifiedEmailToken === '') {
        console.log('Please verify your email, remember to check in trash emails')
        return res.status(404).json({ message: 'Please verify your email, remember to check in trash emails' })
      }
      console.log('success')

      return res.status(200)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  validateUpdatePassword: async (req: Request, res: Response): Promise<any> => {
    try {
      if(req.body.password === ''){
        return res.status(404).json({ message: 'Please fill in password' })
      }
      if(req.body.password !== req.body.retypePassword){
        return res.status(404).json({ message: 'Password must be equal to retype password' })        
      }
      return res.status(200)
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default authValidate
