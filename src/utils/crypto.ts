import CryptoJS from 'crypto-js'
import { config } from 'dotenv'
config()
export const hashPassword = (password: string) =>
  CryptoJS.AES.encrypt(password, process.env.HASH_PASS_SECRET as string).toString()
