import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import UserSchema, { UserType } from '../models/User';
import { ObjectId } from 'mongodb';
import { collections } from './database.service';
import bcrypt from 'bcrypt';
import UserStatus from '../utils/UserStatus';
import { sendForgotPasswordEmail, sendVerificationEmail } from '~/utils/Mailer';
dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || '';

class AuthenticationService {
  async addUser(user: UserType): Promise<UserType | null> {
    const newUser: UserSchema = new UserSchema(user);

    const result = await collections.users?.insertOne(newUser);
    if (result) {
      return newUser as UserType; // Convert UserSchema to UserType
    }
    return null;
  }
  async sendResetPasswordEmail(email: string, forgotPasswordToken: string): Promise<void> {
    await collections.users?.updateOne({ email }, { $set: { forgotPasswordToken } });
    await sendForgotPasswordEmail(email, forgotPasswordToken);
  }

  async sendEmail(user: UserType): Promise<void> {
    await sendVerificationEmail(user.email, user.verifiedEmailToken as string, user.name);
  }

  async findUserWithPassword(email: string, password: string): Promise<UserType | null> {
    const user = (await collections.users?.findOne({ email })) as UserType;
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
  async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
    await collections.users?.updateOne({ email }, { $set: { refreshToken } });
  }

  async updateUserStatus(email: string): Promise<void> {
    await collections.users?.updateOne({ email }, { $set: { status: UserStatus.ACTIVE, verifiedEmailToken: '' } });
  }

  async findUserByEmail(email: string): Promise<UserType | null> {
    return (await collections.users?.findOne({ email })) as UserType;
  }

  async findUserById(id: string): Promise<UserType | null> {
    return (await collections.users?.findOne({ _id: new ObjectId(id) })) as UserType;
  }
  async updateUserPassword(email: string, password: string): Promise<void> {
    const hashedPassword: string = await bcrypt.hash(password, 10);
    await collections.users?.updateOne({ email }, { $set: { password: hashedPassword } });
  }
  async deleteForgotPasswordToken(email: string): Promise<void> {
    await collections.users?.updateOne({ email }, { $set: { forgotPasswordToken: '' } });
  }

  async checkUserStatus(email: string): Promise<UserStatus | null> {
    const user = (await collections.users?.findOne({ email })) as UserSchema;
    if (user) {
      return user.status;
    }
    return null;
  }
}

const AuthenticationServiceInstance = new AuthenticationService();
export default AuthenticationServiceInstance;
