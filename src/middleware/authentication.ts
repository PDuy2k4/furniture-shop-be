import jwt from 'jsonwebtoken';
import { Request, Response,NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '../services/db';

const JWT_SECRET = process.env.JWT_SECRET || 'namdeptrai';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const { userEmail, userPassword } = req.body;
    if (!userEmail || !userPassword) {
        return res.status(400).json({
            message: 'Email and password are required',
        });
    }
    try {
        const db = await connectToDatabase();
        const user = await db.collection('users').findOne({ email: userEmail });
        
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email',
            });
        }

        // Assuming you have a method to compare passwords
        const isPasswordValid = await bcrypt.compare(userPassword, user.password); // Replace with actual password comparison logic
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        if(user.verify == 'PENDING'){
            return res.status(401).json({
                message: 'This is unverified email. Please verify your email',
            });
        }

        user.password = "null";
        console.log(user.password);
        res.json({ user });
    } catch (error) {
        next(error);
    }
}