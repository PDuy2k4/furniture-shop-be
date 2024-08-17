import { MongoClient, ServerApiVersion } from 'mongodb';import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || "your-default-uri-here";
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
let db: any;
let lastConnectionTime: number | null = null;
const CONNECTION_TIMEOUT = 60 * 60 * 1000;
export const connectToDatabase = async () => {
  const currentTime = Date.now();

  if (db && lastConnectionTime && (currentTime - lastConnectionTime < CONNECTION_TIMEOUT)) {
      console.log('Using existing database connection');
      return db;
  }

  try {
      await client.connect();
      db = client.db("ecommerce_dev");
      lastConnectionTime = currentTime;
      console.log('Connected to database');
  } catch (error) {
      console.error('Could not connect to database', error);
      throw error;
  }

  return db;
};