import * as mongoDB from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

export async function connectToDataBase(dbName: string): Promise<mongoDB.Db> {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(`${process.env.ECORMERCE_URL}`)

  await client.connect()

  const db: mongoDB.Db = client.db(dbName)

  console.log('Connected to MongoDB')

  return db
  //we connect to the table and then return the it's connection
}
