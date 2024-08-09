import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { json } from "stream/consumers";
import userSchema, { userType } from "~/models/user";
import userSerive from "~/services/user.service";

const authController = {
    //register
    register: async (req: Request, res: Response) => {
        try {
            const newUser = new userSchema(req.body);
            userSerive.addUser(newUser);
            res.status(200).json(newUser);
        } catch (error) {
            //error response
            res.status(500).json(error);
        }
    }
}

export default authController;