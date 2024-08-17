import { Request, Response,NextFunction } from 'express';
import clientId from '~/constant/connectIDGoogle';
import { connectToDatabase } from '~/services/db';

const fetch = require('node-fetch');
export const googleSignIn = async (req: Request, res: Response, next: NextFunction) => {
    const { credential } = req.body;

    if (!credential) {
        return res.status(400).send('Missing credential');
    }

    const db = await connectToDatabase();
    try {
        
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        
        if (!response.ok) {
        return res.status(400).send('Invalid token');
        }

        const data = await response.json();

        // Verify the audience
        if (data.aud !== clientId) {
        return res.status(400).send('Invalid token audience');
        }

        const { email, name, picture, sub } = data;
        console.log(email, name, picture, sub);

    } catch (error) {
        next(error);
    }
}