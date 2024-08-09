import bcrypt from 'bcrypt'
import { config } from 'dotenv'
config()
export const hashPassword = (password: string) => {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS as string), (err, hash) => {
      if (err) {
        reject(err)
      } else {
        resolve(hash)
      }
    })
  })
}
