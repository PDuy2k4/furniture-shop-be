const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
import { ObjectId } from "mongodb";
import { Profile } from 'passport-google-oauth20';
import IUser  from '../models/user';
import { generateRandomPassword } from '~/constant/randomPass';
import { connectToDatabase } from "./db";

function stringToObjectId(id: string): ObjectId {
    return new ObjectId(id);
}

export const configurePassport = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!
    }, async (
        accessToken: string, 
        refreshToken: string, 
        profile: Profile, 
        done: (error: any, user?: any) => void
    ) => {
        const db = await connectToDatabase();
        await db.collection('users').findOne({ googleId: profile.id }, (err: any, doc: any) => {
            if (err) {
                return done(err, null);
            }
            const hashedPassword = generateRandomPassword(12);
            const _id = stringToObjectId(profile.id);
            if (!doc) {
                const newUser = new IUser(
                    _id,
                    profile.displayName,
                    profile.emails![0].value,
                    hashedPassword,
                    profile.photos![0].value, // profileImg
                    false, // isAdmin
                    '', // forgotPasswordToken
                    '', // verifiedEmailToken
                    '', // refreshToken
                    new Date().toISOString(), // createdAt
                    new Date().toISOString() // updatedAt
                );
                db.collection('users').insertOne(newUser);
                done(null, newUser);
            }
            done(null, doc);
        });
    }));

//   passport.serializeUser((user, done) => {
//       done(null, user);
//   });

//   passport.deserializeUser((user, done) => {
//       done(null, user);
//   });
};