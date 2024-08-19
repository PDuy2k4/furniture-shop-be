import { randomBytes } from 'crypto'
import dotevn from 'dotenv'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import userSchema from '~/models/user'
import userService from '~/services/user.service'
import random from './randomPassword'
import { userVerifyStatus } from '~/constants/enum'

dotevn.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL: 'http://localhost:8000/v1/auth/google/callback'
    },
    async (accessToken, refreshToken, profile: any, done) => {
      return done(null, profile)
    }
  )
)

passport.serializeUser(async (profile: any, done) => {
  try {
    let userFinding = await userService.findUserByEmail(profile?.emails[0].value)
    console.log(userFinding)

    if(!userFinding){
      console.log('login by email')
      const passwordRandom = await random(5)
      const userAdd = new userSchema({
        email: profile.emails[0].value,
        name: profile.displayName,
        isAdmin: false,
        profileImg: profile?.photos[0]?.value,
        verify: userVerifyStatus.Verified,
        password: passwordRandom as string
      })
      userFinding = await userService.addUser(userAdd)
      done(null, userFinding?.insertedId)
    }
    done(null, userFinding?._id)

  } catch (error) {
    done(null)
  }
})

passport.deserializeUser(async (_id: any, done) => {
  try {
    if(_id){
      const user = await userService.findUserById(_id)
      done(null, user)
    }
  } catch (error) {
    done(error, null)
  }
})
