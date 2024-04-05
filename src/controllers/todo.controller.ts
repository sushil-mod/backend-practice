import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { USERS } from "../db/users";
import { userLoginSchema } from "../schema/user.schema";
import jwt from "jsonwebtoken";
import { Todo, User } from "../types/userTypes";
import { v4 as uuidv4 } from 'uuid';

export async function getTodos(req:Request,res:Response) {
    try {
        const { user } = req;
        res.status(200).json({statusCode:200,data:user.todos});
        return
    } catch (error) {
        if(error instanceof ZodError){
            return res.status(400).json(error.issues.map(({message}) =>message))
        }
    }
}

export async function getTodoById (req:Request,res:Response){
    const {id } = req.params;
    const { user } = req;
    let todo = user.todos.find(ele=>ele.id === id);
    if(todo){
        res.status(200).send({data:todo});
    }{
        res.status(200).send({message:"No Todo for this id"});    
    }
}

export async function addTodos(req:Request,res:Response) {
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
}

export async function deleteTodoById(req:Request,res:Response) {
    const {id} = req.params;
    const {user} = req;

    let todos = user.todos?.filter((todo:Todo) =>todo.id !== id);
    
    USERS.forEach(item => {
        if(item.username === user.username){ 
            item.todos=todos;
        }
        return item;
    });
    res.status(200).send("todo deleted successfully");
}
