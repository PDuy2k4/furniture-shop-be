import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config()

const signToken = {
    signAccessToken: (user: any) => {
        return jwt.sign(
            {
              _id: user._id,
              isAdmin: user.isAdmin,
              email: user.email
            },
            `${process.env.JWT_ACCESS_KEY}`,
            { expiresIn: '1h' }
          )
    },

    signRefreshToken: (user: any) => {
        return jwt.sign(
            {
              _id: user._id,
              isAdmin: user.isAdmin,
              email: user.email
            },
            `${process.env.JWT_REFRESH_KEY}`,
            { expiresIn: '365d' }
          )
    }
}

export default signToken