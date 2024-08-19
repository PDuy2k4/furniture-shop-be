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

authRoute.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

authRoute.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }), (req, res) => {
  try {
    console.log('callbaqck')
    if(req.user){
      console.log('Login by email successfully')
      res.redirect('http://localhost:3000/login')
      res.status(200).json({message: "Login by email successfully"}) // Chuyển hướng đến route mong muốn sau khi đăng nhập thành công
    }
    else{
      console.log(req.user)
      console.log('Email already exists')
      res.redirect('http://localhost:3000/login')
      res.status(400).json({ message: 'Email already exists'})  
    }
  } catch (error) {
    res.status(404).json({ message: error})  
    res.redirect('http://localhost:3000/login')
  }
})

export default authRoute
