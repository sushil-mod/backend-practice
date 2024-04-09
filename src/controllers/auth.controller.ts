import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { USERS } from "../db/users";
import { userLoginSchema } from "../schema/user.schema";
import jwt from "jsonwebtoken";
import { User } from "../types/userTypes";

let secret = "todoAppSceret";

export async function userLogin(req:Request,res:Response) {
    try {
            const { username , password } = userLoginSchema.parse(req.body);
            const isUser = USERS?.some((user) => user?.username === username);
            if(isUser){
                const user = USERS?.find((user) => user?.username === username);
                if(user?.password === password){
                    const token = jwt.sign(req.body,secret);
                    res.status(200).send({message:"Logged in successfully",token});
                    return
                } 
                res.status(401).send({message:"Incorrect Credential"})
                return;
            }else{
                res.status(401).send({message:"Incorrect Credentials"});
                return;
            }    
    } catch (error) {
        if(error instanceof ZodError){
            return res.status(400).json(error.issues.map(({message}) =>message))
        }
    }
}

export async function userSignin(req:Request,res:Response){
    try {
        const {username,password} = userLoginSchema.parse(req.body);
        const isExist = USERS?.some((user) => user?.username === username);

        if(isExist){
            res.status(409).send({message:"User already exists"});
            return;
        }else{
            let newUser:User = {
                username,
                password,
                isActive:true,
                todos:[]
            }
            USERS.push(newUser);
            let data = {
                username:newUser.username,
                isActive:newUser.isActive,
                todos:newUser.todos
            }
            const token = jwt.sign({username,password},secret);
            res.status(200).send({message:"User has been registered successfully",data,token});
            return;
        }
    } catch (error) {
        if(error instanceof ZodError){
            res.status(400).json(error.issues.map(({message}) =>message))
            return; 
        }
    }
}


