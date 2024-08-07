import { MongoClient, ServerApiVersion, Db } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()
class DatabaseService {
  client: MongoClient
  database: Db
  constructor() {
    this.client = new MongoClient(
      `mongodb+srv://dbUser01:${process.env.DB_PASS as String}@e-commercecluster.vidtdgi.mongodb.net/?retryWrites=true&w=majority&appName=E-CommerceCluster`,
      {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true
        }
      }
    )
    this.database = this.client.db('ecommerce_dev')
  }
  async run() {
    try {
      await this.client.connect()
      await this.database.command({ ping: 1 })
      console.log('Connected to MongoDB')
    } catch (err) {
      console.log('Failed to connect to MongoDB', err)
    }
  }
  get user() {
    return this.database.collection('users')
  }
}

const databaseService = new DatabaseService()
export default databaseService
