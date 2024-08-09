import { userType } from '~/models/user'
import { connectToDataBase } from './database.service'
import * as mongoDB from 'mongodb'

const userSerive = {
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
      const addedUser = await userCollection.insertOne(user)
      return addedUser
    } catch (error) {
      throw error
    }
  },

  // Example function to find a user
  findUserByEmail: async function (email: string): Promise<any> {
    try {
      const userCollection = await this.getUserCollection()
      const foundUser = await userCollection.findOne({ userEmail: email })
      return foundUser
    } catch (error) {
      throw error
    }
  }
}

export default userSerive

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
