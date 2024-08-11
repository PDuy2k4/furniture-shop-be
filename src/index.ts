import express, { Express, Request, Response, json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/UserRoutes';
import { connectToDatabase } from './services/database.service';
const app: Express = express();
const PORT: number = 8000;

dotenv.config();
app.use(json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send(`http://localhost:${PORT}/api/auth`);
});
app.use('/api/auth', userRouter);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}/`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed', error);
  });
