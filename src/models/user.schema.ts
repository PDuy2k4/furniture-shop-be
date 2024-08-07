import { ObjectId } from 'mongodb'
import { userVerifyStatus } from '~/constants/enum'
export type userType = {
  _id?: ObjectId
  name: string
  email: string
  password: string
  profileImg?: string
  isAdmin?: boolean
  forgotPasswordToken?: string
  verifiedEmailToken?: string
  verify?: userVerifyStatus
  refreshToken?: string
  createdAt?: string
  updatedAt?: string
}

export default class UserSchema {
  _id: ObjectId
  name: string
  email: string
  password: string
  profileImg: string
  isAdmin: boolean
  forgotPasswordToken: string
  verifiedEmailToken: string
  verify: userVerifyStatus
  refreshToken: string
  createdAt: string
  updatedAt: string
  constructor(user: userType) {
    this._id = user._id || new ObjectId()
    this.name = user.name
    this.email = user.email
    this.password = user.password
    this.profileImg = user.profileImg || ''
    this.isAdmin = user.isAdmin || false
    this.forgotPasswordToken = user.forgotPasswordToken || ''
    this.verifiedEmailToken = user.verifiedEmailToken || ''
    this.verify = user.verify || userVerifyStatus.Unverified
    this.refreshToken = user.refreshToken || ''
    this.createdAt = user.createdAt || new Date().toISOString()
    this.updatedAt = user.updatedAt || new Date().toISOString()
  }
}
