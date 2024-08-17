import jwt from 'jsonwebtoken';
import { Request, Response,NextFunction } from 'express';
import { connectToDatabase } from '../services/db';
import { sendEmail } from '~/services/sendEmailService';

const JWT_SECRET = process.env.JWT_SECRET || 'namdeptrai';

export const requestChaning = async (req: Request, res: Response, next: NextFunction) => {
    const { userEmail } = req.body;
    if (!userEmail) {
        return res.status(400).json({
            message: 'Email is required',
        });
    }
    try {
        const db = await connectToDatabase();
        const user = await db.collection('users').findOne({ email: userEmail });
        
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email ',
            });            
        }
        const token = jwt.sign({ userEmail: user.email }, JWT_SECRET, { expiresIn: '1h' });

        await db.collection('users').updateOne(
            { email: "dpbac010@gmail.com" }, // Filter object
            { $set: { refreshToken: token } } // Update object with valid update operators
        );

        await sendEmail(userEmail, token, 'reset');
        return res.status(200).json({
            message: 'Please check your email to reset password',
        });
    } catch (error) {
        next(error);
    }
}