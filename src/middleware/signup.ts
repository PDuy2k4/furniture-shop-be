import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '../services/db';
import IUser  from '../models/user';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import  {sendEmail}  from '../services/sendEmailService';
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'namdeptrai';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { userName,userEmail, userPassword } = req.body;
    if (!userEmail || !userPassword) {
        return res.status(400).json({
            message: 'Email and password are required',
        });
    }

    try {
        const db = await connectToDatabase();
        const existingUser = await db.collection('users').findOne({ email: userEmail });
        if (existingUser) {
            return res.status(409).json({
                message: 'Email already in use',
            });
        }

        const hashedPassword = await bcrypt.hash(userPassword, SALT_ROUNDS);
        const verificationToken =jwt.sign({ userEmail }, JWT_SECRET, { expiresIn: '1h' });
        
        const newUser = new IUser(
            new ObjectId(),
            userName,
            userEmail,
            hashedPassword,
            '', // profileImg
            false, // isAdmin
            '', // forgotPasswordToken
            verificationToken, // verifiedEmailToken
            '', // refreshToken
            new Date().toISOString(), // createdAt
            new Date().toISOString() // updatedAt
        );
        console.log(verificationToken);
        await db.collection('users').insertOne(newUser);
        await sendEmail(userEmail, verificationToken, 'verify');
        return res.status(201).json({
            message: 'User registered successfully. Please check your email to verify your account.',
        });
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};