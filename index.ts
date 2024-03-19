import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import {z,ZodError} from "zod";

const express = require("express");
const jwt = require("jsonwebtoken");
let port = 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

interface Todo {
    id:string,
    title:string,
    description:string
}
interface User {
    username:string,
    password:string,
    isActive:boolean,
    todos:Todo[]
}

interface RequestedUser extends Request{
    user:User
}
console.log("server");

let USERS:Array<User> = [];
let secret = "todoAppSceret";

const userLoginSchema = z.object({
    username:z.string().min(1,"Username is required"),
    password:z.string().min(5,"Password must have atleast 5 character")

})

const authenticateUser = (req:RequestedUser,res:Response,next:NextFunction) => {
    console.log("middlewarre");
    const authorization = req.headers['authorization'];
    console.log("authorization",authorization);
    const token = authorization?.split(" ")[1];
   
    if(!token){
        res.send({message:"token not Found"});
    }
    let decodedToken = jwt.verify(token,secret);
    console.log("decodedToken",decodedToken);
    let user = USERS.find(userItem => userItem.username === decodedToken.username );
    console.log("user",user);
    if(user){
        req.user = user;
        next();
    }else{
        res.status(400).send({message:"Unauthorized"});
    }
}

app.post("/login",(req:Request,res:Response)=>{
    try {
        const { username , password } = userLoginSchema.parse(req.body);
        const isUser = USERS?.some((user) => user?.username === username);
        if(isUser){
            const user = USERS?.find((user) => user?.username === username);
            if(user?.password === password){
                const token = jwt.sign(req.body,secret);
                res.status(200).send({message:"Logged in successfully",token});
            } 
            res.status(401).send({message:"Incorrect Credential"})
    
        }else{
            res.status(401).send({message:"Incorrect Credential"});
        }    
    } catch (error ) {
        if(error instanceof ZodError){
            console.log("Error",error.issues)
            return res.status(400).json(error.issues.map(({message}) =>message))
        }
    }    
    
});

app.post("/signin",(req:Request,res:Response)=>{
    console.log("signin");
    const {username,password}:User = req.body;
    const isExist = USERS?.some((user) => user?.username === username);
    if(isExist){
        res.status(409).send({message:"User already Exist"})
    }else{
        let newUser:User = {
            username,
            password,
            isActive:true,
            todos:[]
        }
        USERS=[...USERS,newUser];

        const token = jwt.sign({username,password},secret);
        
        res.status(200).send({message:"User has been registered successfully",token});
    }
});

app.get("/todos",authenticateUser,(req:RequestedUser,res:Response)=>{
    console.log("user");
    const { user } = req;
    console.log("user",user);
    res.status(200).send({data:user.todos});
});

app.get("/todos/:id",authenticateUser,(req:RequestedUser,res:Response)=>{
    const {id } = req.params;
    const { user } = req;
    let todo = user.todos.find(ele=>ele.id === id);
    if(todo){
        res.status(200).send({data:todo});
    }{
        res.status(200).send({message:"No Todo for this id"});    
    }
});

app.post("/todo",authenticateUser,(req:RequestedUser,res:Response)=>{
    const reqBody = req.body;
    const { user } = req;
    let newTodo:Todo = {
        title:reqBody.title,
        description:reqBody.description,
        id:uuidv4()
    }
    const updatedUserTodo = [...user.todos , newTodo];
    USERS.forEach(item => {
        if(item.username === user.username){
            item.todos=updatedUserTodo;
        }
        return item
    });
    res.status(200).send({data:newTodo,message:"Todo added successfully"});
});

app.delete("/todo/:id",authenticateUser,(req:RequestedUser,res:Response)=>{
    const {id} = req.params;
    const {user} = req;

    let todos = user.todos?.filter((todo) =>todo.id !== id);
    
    USERS.forEach(item => {
        if(item.username === user.username){
            item.todos=todos;
        }
        return item;
    });
    res.send("todo deleted successfully");
});

app.listen(port,()=>console.log("listening on",port));

