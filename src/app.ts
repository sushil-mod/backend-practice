
import express from "express";
import { userLogin, userSignin } from "./controllers/auth.controller";
import { addTodos, deleteTodoById, getTodoById, getTodos } from "./controllers/todo.controller";
import { authenticateUser } from "./middlewares/auth.middleware";

export const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.post("/login",userLogin);

app.post("/signin",userSignin);

app.get("/todos",authenticateUser,getTodos);

app.get("/todos/:id",authenticateUser,getTodoById);

app.post("/todo",authenticateUser,addTodos);
 
app.delete("/todo/:id",authenticateUser,deleteTodoById);