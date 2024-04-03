import { NextFunction, Request, Response } from "express";
import { User } from "../types/userTypes";
import jwt from "jsonwebtoken";
import { USERS } from "../db/users";

let secret = "todoAppSceret";

export function  authenticateUser (req:Request,res:Response,next:NextFunction){
    const authorization = req.headers['authorization'];
    const token = authorization?.split(" ")[1];
    if(!token){
        return res.send({message:"token not Found"});
        
    }
    let decodedToken = jwt.verify(token,secret) as User;
    let user = USERS.find(userItem => userItem.username === decodedToken.username );
    if(user){
        req.user = user;
        next();
        
    }else{
        res.status(400).send({message:"Unauthorized"});
    }

}