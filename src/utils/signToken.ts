import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
import jwt from 'jsonwebtoken'
import { secretKeyJWT } from '~/constants/secretKeyJWT'
import { expirationJWT } from '~/constants/expirationJWT'
config()

export const signToken = (action: { type: string; payload: { _id: ObjectId; isAdmin: boolean } }) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      action.payload,
      secretKeyJWT[action.type],
      { algorithm: 'HS256', expiresIn: expirationJWT[action.type] },
      function (err, token) {
        if (err) {
          reject(err)
        } else {
          resolve(token)
        }
      }
    )
  })
}
