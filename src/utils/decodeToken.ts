import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

import { secretKeyJWT } from '~/constants/secretKeyJWT'

export const decodeToken = (type: string, token: string) => {
  return new Promise<{ _id: ObjectId; isAdmin: boolean }>((resolve, reject) => {
    jwt.verify(token, secretKeyJWT[type] as string, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        const { _id, isAdmin } = decoded as { _id: ObjectId; isAdmin: boolean }
        resolve({ _id, isAdmin })
      }
    })
  })
}
