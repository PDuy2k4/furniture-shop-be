import jwt from 'jsonwebtoken';
import { Request, Response,NextFunction } from 'express';

import { connectToDatabase } from '../services/db';
import { chagingPassword } from '~/services/changingPassword';

const JWT_SECRET = process.env.JWT_SECRET || 'namdeptrai';
export const resetPass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({
            message: 'Authorization token is required',
          });
        }
    
        let decodedToken;
        try {
          decodedToken = jwt.verify(token, JWT_SECRET);
        } catch (error) {
          return res.status(401).json({
            message: 'Invalid or expired token',
          });
        }
    
        const { password, confirmPassword } = req.body;
        if (!password || !confirmPassword) {
          return res.status(400).json({
            message: 'Password and new password are required',
          });
        }
    
        const db = await connectToDatabase();
        const { userEmail } = decodedToken as { userEmail: string };

        const existingUser = await db.collection('users').findOne({ email: userEmail });
    
        if (!existingUser) {
          return res.status(404).json({
            message: 'User not found',
          });
        }
    
        if (await chagingPassword(password, confirmPassword, existingUser)) {
          return res.status(200).json({
            message: 'Password changed successfully',
          });
        } else {
          console.log('Something went wrong');
          return res.status(500).json({
            message: 'Something went wrong',
          });
        }
      } catch (error) {
        next(error);
      }
}