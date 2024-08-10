import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
export const verifyToken = (token: string, secretKey: string) => {
  return new Promise<{ _id: ObjectId; isAdmin: boolean }>((resolve, reject) => {
    jwt.verify(token, secretKey, function (err, decoded) {
      if (err) {
        reject(null)
      }
      resolve(decoded as { _id: ObjectId; isAdmin: boolean })
    })
  })
}
