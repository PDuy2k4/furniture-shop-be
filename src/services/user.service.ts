import databaseService from '~/services/database.service'
import userType from '~/models/user.schema'
import { ObjectId } from 'mongodb'
class UserService {
  async getUserByEmail(email: string) {
    try {
      const user = await databaseService.user.findOne({ email: email })
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
      console.log(updatedUser)
      return updatedUser
    } catch (err) {
      console.log(err)
    }
  }
}
const userService = new UserService()
export default userService
