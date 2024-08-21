import { userType } from '~/models/user'
import { connectToDataBase } from './database.service'
import { ObjectId } from 'mongodb'
import * as mongoDB from 'mongodb'

const userService = {
  getUserCollection: async function (): Promise<mongoDB.Collection> {
    try {
      const db = await connectToDataBase('ecommerce_dev')
      return db.collection('users')
    } catch (error) {
      throw error
    }
  },

  addUser: async function (user: userType): Promise<any> {
    try {
      const userCollection = await this.getUserCollection()
      console.log('Connected to addUser')
      const addedUser = await userCollection.insertOne(user)
      return addedUser
    } catch (error) {
      console.error('Error adding user:', error)
      return null
    }
  },

  // Example function to find a user
  findUserByEmail: async function (email: string): Promise<any> {
    try {
      const userCollection = await this.getUserCollection()
      console.log('Connected to findUserByEmail')
      const foundUser = await userCollection.findOne({ email: email })
      if (foundUser) {
        console.log('found email')
        return foundUser
      } else return null
    } catch (error) {
      console.error('Error finding user by email:', error)
      return null
    }
  },

  findUserById: async function (id: string): Promise<any> {
    try {
      const userCollection = await this.getUserCollection()
      console.log('Connected to findUserById')
      const foundUser = await userCollection.findOne({ _id: new ObjectId(id) })
      return foundUser
    } catch (error) {
      console.error('Error finding user by ID:', error)
      return null
    }
  },

  updateVerifiedEmailUser: async function (id: string, verify: object) {
    try {
      const userCollection = await this.getUserCollection()
      console.log('Connected to updateVerifiedEmailUser')
      const result = await userCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...verify } }
      )

      return result
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error)
    }
  }
}

export default userService
// export async function getUserCollection(): Promise<mongoDB.Collection> {
//     try {
//         const db = await connectToDataBase('userDB');
//         return db.collection('users');
//     } catch (error) {
//         throw (error);
//     }
// }

// export async function addUser(user: userType): Promise<any> {
//     try {
//         const userCollection = await getUserCollection();
//         const addedUser =  await userCollection.insertOne(user);
//         return addedUser;
//     } catch (error) {
//         throw(error);
//     }
//   }

//   // Example function to find a user
//   export async function findUserByEmail(email: string): Promise<any> {
//     try {
//         const userCollection = await getUserCollection();
//         const foundUser =  await userCollection.findOne({userEmail: email});
//         return foundUser;
//     } catch (error) {
//         throw(error);
//     }
//   }
