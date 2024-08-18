import { ObjectId } from 'mongodb';
import UserStatus from '../utils/UserStatus';
export type UserType = {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  profileImg?: string;
  isAdmin?: boolean;
  forgotPasswordToken?: string;
  verifiedEmailToken?: string;
  status?: UserStatus;
  refreshToken?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default class UserSchema {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  profileImg: string;
  isAdmin: boolean;
  forgotPasswordToken: string;
  verifiedEmailToken: string;
  status: UserStatus;
  refreshToken: string;
  createdAt: string;
  updatedAt: string;
  constructor(user: UserType) {
    this._id = user._id || new ObjectId();
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.profileImg =
      user.profileImg ||
      'https://static.vecteezy.com/system/resources/thumbnails/013/360/247/small/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg';
    this.isAdmin = user.isAdmin || false;
    this.forgotPasswordToken = user.forgotPasswordToken || '';
    this.verifiedEmailToken = user.verifiedEmailToken || '';
    this.status = user.status || UserStatus.PENDING;
    this.refreshToken = user.refreshToken || '';
    this.createdAt = user.createdAt || new Date().toISOString();
    this.updatedAt = user.updatedAt || new Date().toISOString();
  }
}
