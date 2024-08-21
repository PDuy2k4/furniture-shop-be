import { randomBytes } from 'crypto'
import dotenv from 'dotenv'
import passport, { use } from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import userSchema from '~/models/user'
import userService from '~/services/user.service'
import random from './randomPassword'
import { userVerifyStatus } from '~/constants/enum'

dotenv.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL: 'http://localhost:8000/v1/auth/google/callback'
    },
    async (accessToken, refreshToken, profile: any, done) => {
      try {
        let user = await userService.findUserByEmail(profile.emails[0].value)

        if (!user) {
          const passwordRandom = await random(5)
          const newUser = new userSchema({
            email: profile.emails[0].value,
            name: profile.displayName,
            isAdmin: false,
            profileImg: profile?.photos[0]?.value,
            verify: userVerifyStatus.Verified,
            password: passwordRandom as string
          })

          user = await userService.addUser(newUser)
        }

        done(null, user)
      } catch (error) {
        done(error)
      }
    }
  )
)

passport.serializeUser((user: any, done) => {
  done(null, user.insertedId || user._id)
})

passport.deserializeUser(async (insertedId: any, done) => {
  try {
    const user = await userService.findUserById(insertedId)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})
