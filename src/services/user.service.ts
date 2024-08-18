import databaseService from '~/services/database.service'
import userType from '~/models/user.schema'
import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import axios from 'axios'

import { json } from 'stream/consumers'
import { decodeStringUTF8 } from '~/utils/decodeUTF8'
config()
class UserService {
  async getUserByEmail(email: string) {
    try {
      const user = await databaseService.user.findOne<userType>({ email: email })
      return user
    } catch (err) {
      console.log(err)
    }
  }
  async getUserByID(id: ObjectId) {
    try {
      const user = await databaseService.user.findOne<userType>({ _id: id })
      return user
    } catch (err) {
      console.log(err)
    }
  }
  async addUser(user: userType) {
    try {
      const newUser = await databaseService.user.insertOne(user)
      return newUser
    } catch (err) {
      console.log(err)
    }
  }
  async updateUser(id: ObjectId, update: { [key: string]: any }) {
    try {
      const updatedUser = await databaseService.user.updateOne({ _id: id }, { $set: update })
      return updatedUser
    } catch (err) {
      console.log(err)
    }
  }
  async getOauthGoogleToken(code: string) {
    const body = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }
    const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return data
  }
  async getUserByGoogleToken(token: string) {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    const { email, name, picture } = decoded
    return { email, name: decodeStringUTF8(name), profileImg: picture }
  }
}
const userService = new UserService()
export default userService
