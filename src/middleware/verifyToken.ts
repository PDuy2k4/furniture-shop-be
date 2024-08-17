import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { connectToDatabase } from '../services/db';
const JWT_SECRET = process.env.JWT_SECRET || 'namdeptrai';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const {token} = req.body;
    const db = await connectToDatabase();
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
    try {
        //ensures TypeScript treats decoded as a JwtPayload object, which typically contains information like exp (expiration time).
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        if (decoded.exp && decoded.exp * 1000 < new Date().getTime()) {
            return res.status(401).json({
                message: 'Token has expired',
            });
        }
        const existingUser = await db.collection('users').findOne({ verifiedEmailToken: token });
        if (!existingUser) {
            return res.status(401).json({
                message: 'No user in database',
            });
        }
        if (existingUser.verifiedEmailToken !== token) {
            return res.status(401).json({
                message: 'Wrong token',
            });
        }
        if (existingUser.verifiedEmailToken === token) {
            if(existingUser.verify === 'VERIFIED') {
                return res.status(401).json({
                    message: 'You has already verified',
                });
            }else{
                await db.collection('users').updateOne({ verifiedEmailToken: token }, { $set: { verify: 'VERIFIED' }});
            }
        }
        return res.status(201).json({
            message: 'User registered successfully. Please check your email to verify your account.',
        });
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
};