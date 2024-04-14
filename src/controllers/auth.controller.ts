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
                let data={
                    username : user.username,
                    isActive:user.isActive
                }
                res.status(200).send({data,statusCode:200,message:"Logged in successfully",token,});
                return
            } 
            res.status(401).send({statusCode:401,message:"Incorrect Credential"})
            return;
        }else{
            res.status(401).send({statusCode:401,message:"Incorrect Credential"});
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
            res.status(409).json({statusCode:409,message:"User already exists"});
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
            res.status(200).json({statusCode:200,message:"User has been registered successfully",data,token});
            return;
        }
    } catch (error) {
        if(error instanceof ZodError){
            res.status(400).json({statusCode:400,message:"Bad Request"})
            return; 
        }
    }
}


