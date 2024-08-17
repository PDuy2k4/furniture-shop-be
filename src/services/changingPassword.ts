
import { connectToDatabase } from '../services/db';
import bcrypt from 'bcrypt';
const JWT_SECRET = process.env.JWT_SECRET || 'namdeptrai';


export const chagingPassword = async (password: string, newPassword: string, existingUser: any) => {
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const db = await connectToDatabase();
    await db.collection('users').updateOne({ _id: existingUser._id }, { $set: { password: newPasswordHash } });
    return true;
}