import { ObjectId } from "mongodb";


export default class IUser {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    profileImg: string;
    isAdmin: boolean;
    forgotPasswordToken: string;
    verifiedEmailToken: string;
    verify: string;
    refreshToken: string;
    createdAt: string;
    updatedAt: string;

    constructor(
        _id: ObjectId,
        name: string,
        email: string,
        password: string,
        profileImg: string , 
        isAdmin: boolean = false, 
        forgotPasswordToken: string ,
        verifiedEmailToken: string ,
        refreshToken: string ,
        createdAt: string,
        updatedAt: string
    ) {
        this._id = _id || new ObjectId();
        this.name = name;
        this.email = email;
        this.password = password;
        this.profileImg = profileImg|| '';
        this.isAdmin = isAdmin;
        this.forgotPasswordToken = forgotPasswordToken || '';
        this.verifiedEmailToken = verifiedEmailToken|| '';
        this.verify = 'PENDING';
        this.refreshToken = refreshToken|| '';
        this.createdAt = createdAt || new Date().toISOString();
        this.updatedAt = updatedAt || new Date().toISOString(); 
    }
}
