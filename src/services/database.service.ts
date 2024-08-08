import * as mongoDB from 'mongodb'
import * as dotenv from 'dotenv'

export async function connectToDataBase(dbName: string): Promise<mongoDB.Db> {
  dotenv.config()

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.MONGODB_URL || "")

  await client.connect();

  const db: mongoDB.Db = client.db(dbName);
  
  console.log("Connected to MongoDB")

  //we connect to the table and then return the it's connection
  return db;
}
