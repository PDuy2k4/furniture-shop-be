// External Dependencies
import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';
// Global Variables
export const collections: { users?: mongoDB.Collection; products?: mongoDB.Collection } = {};
// Initialize Connection
export async function connectToDatabase() {
  dotenv.config();
  const MONGODB_URI: string = process.env.DB_CONN_STRING || '';
  const DB_NAME: string = process.env.DB_NAME || '';
  const USERS_COLLECTION_NAME: string = process.env.USERS_COLLECTION_NAME || '';

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(MONGODB_URI);

  await client.connect();

  const db: mongoDB.Db = client.db(DB_NAME);

  const usersCollection: mongoDB.Collection = db.collection(USERS_COLLECTION_NAME);
  collections.users = usersCollection;
  console.log(
    `Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`
  );
}
