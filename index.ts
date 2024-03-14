import { NextFunction, Request, Response } from "express";
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
    isActive:boolean
}
interface RequestedUser extends Request {
    user:User
}

let todos:Array<Todo> = [];
let counter = 1;
let USER:Array<User> = [];
let secret = "todoAppSceret";

const authenticateUser = (req:RequestedUser,res:Response,next:NextFunction) => {
    const authorization = req.headers['authorization'];
    const token = authorization?.split(" ")[1];
    if(!token){
        res.send({message:"token not Found"});
    }
    jwt.verify(token,secret,(err:Error,user:User)=>{
        if(err){
            res.send({message:"Unauthorized"})
        }
        req.user = user;
        next();
    })
}

app.post("/login",(req:RequestedUser,res:Response)=>{
    const { username , password } = req.body;
    const isUser = USER?.some((user) => user?.username === username);
    if(isUser){
        const user = USER?.find((user) => user?.username === username);
        if(user?.password === password){
            const token = jwt.sign(req.body,secret);
            res.send({message:"Logged in successfully",token});
        } 
        res.send({message:"Incorrect Password"})
    }else{
        res.send({message:"Invalid Username"});
    }
});

app.post("/signin",(req:RequestedUser,res:Response)=>{
    const {username,password} = req.body;
    const isExist = USER?.some((user) => user?.username === username);
    if(isExist){
        res.send({message:"User already Exist"})
    }else{
        USER=[...USER,{username,password,isActive:false}]
        const token = jwt.sign({username,password},secret);
        res.send({message:"User has been registered successfully",token});
    }
});
app.get("/todos",authenticateUser,(req:RequestedUser,res:Response)=>{
    res.send({data:todos});
});
app.get("/todos/:id",authenticateUser,(req:RequestedUser,res:Response)=>{
    const {id} = req.params;
    let resposne = todos?.find((todo) => todo?.id === id )
    res.send({data:resposne});
});
app.post("/todo",authenticateUser,(req:RequestedUser,res:Response)=>{
    const reqBody= req.body;
    let newTodo = {...reqBody,id:counter};
    todos = [...todos,newTodo];
    counter++ ;
    res.send({data:newTodo});
});
app.delete("/todo/:id",authenticateUser,(req:RequestedUser,res:Response)=>{
    const {id} = req.query;
    todos = todos?.filter((todo) =>todo?.id === id);
    res.send("todo deleted successfully");
});

app.listen(port,()=>console.log("listening on",port));

