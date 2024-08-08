import { ObjectId } from "mongodb";
import { userVerifyStatus } from '../constants/enum' 

export type userType = {
    _id?: ObjectId
    userName: string
    userEmail: string
    userPassword: string
    profilePicture?: string
    isAdmin: boolean
    forgotPasswordToken?: string
    verifiedEmailToken?: string
    verify?: userVerifyStatus
    refreshToken?: string
    createdAt?: string
    updatedAt?: string
}

export default class userSchema {
    _id: ObjectId
    userName: string
    userEmail: string
    userPassword: string
    profilePicture: string
    isAdmin: boolean
    forgotPasswordToken: string
    verifiedEmailToken: string
    verify: userVerifyStatus
    refreshToken: string
    createdAt: string
    updatedAt: string
    constructor(user: userType){
        this._id = user._id || new ObjectId()
        this.userEmail = user.userEmail
        this.userPassword = user.userPassword
        this.userName = user.userName
        this.profilePicture = user.profilePicture || ""
        this.isAdmin = user.isAdmin
        this.forgotPasswordToken = user.forgotPasswordToken || ""
        this.verifiedEmailToken = user.verifiedEmailToken || ""
        this.verify = user.verify || userVerifyStatus.Unverified
        this.refreshToken = user.refreshToken || ""
        this.createdAt = user.createdAt || ""
        this.updatedAt = user.updatedAt || ""
    }
}