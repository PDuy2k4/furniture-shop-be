import express, { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import passport from 'passport'
import authController from '~/controllers/authController'
import userSerive from '~/services/user.service'

//CRUD

const authRoute = express.Router()
authRoute.use(express.json())

authRoute.post('/register', authController.register)

authRoute.post('/login', authController.logIn)

authRoute.get('/verify-email', authController.verifyEmail)

authRoute.post('/forgotpassword', authController.forgotPassword)

authRoute.get('/verify-forgot-password-email', authController.verifyForgotPasswordEmail)

authRoute.post('/updatepassword', authController.updateNewPassword)

authRoute.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

authRoute.get('/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.LOGIN_URL}` }), (req, res) => {
  
  try {
    console.log('callback');
    if (req.user) {
      console.log('Login by email successfully');
      // Redirect to the desired route after successful login
      res.status(200).redirect(`${process.env.HOME_URL}`); // Chuyển hướng đến route mong muốn sau khi đăng nhập thành công
    } else {
      console.log('Error logging in');
      res.redirect(`${process.env.LOGIN_URL}`);
    }
  } catch (error) { 
    console.error(error);
    res.redirect(`${process.env.LOGIN_URL}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

export default authRoute
