"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const zod_1 = require("zod");
const express = require("express");
const jwt = require("jsonwebtoken");
let port = 8000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
console.log("server");
let USERS = [];
let secret = "todoAppSceret";
const userLoginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, "Username is required"),
    password: zod_1.z.string().min(5, "Password must have atleast 5 character")
});
const authenticateUser = (req, res, next) => {
    console.log("middlewarre");
    const authorization = req.headers['authorization'];
    console.log("authorization", authorization);
    const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[1];
    if (!token) {
        res.send({ message: "token not Found" });
    }
    let decodedToken = jwt.verify(token, secret);
    console.log("decodedToken", decodedToken);
    let user = USERS.find(userItem => userItem.username === decodedToken.username);
    console.log("user", user);
    if (user) {
        req.user = user;
        next();
    }
    else {
        res.status(400).send({ message: "Unauthorized" });
    }
};
app.post("/login", (req, res) => {
    try {
        const { username, password } = userLoginSchema.parse(req.body);
        const isUser = USERS === null || USERS === void 0 ? void 0 : USERS.some((user) => (user === null || user === void 0 ? void 0 : user.username) === username);
        if (isUser) {
            const user = USERS === null || USERS === void 0 ? void 0 : USERS.find((user) => (user === null || user === void 0 ? void 0 : user.username) === username);
            if ((user === null || user === void 0 ? void 0 : user.password) === password) {
                const token = jwt.sign(req.body, secret);
                res.status(200).send({ message: "Logged in successfully", token });
            }
            res.status(401).send({ message: "Incorrect Credential" });
        }
        else {
            res.status(401).send({ message: "Incorrect Credential" });
        }
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            console.log("Error", error.issues);
            return res.status(400).json(error.issues.map(({ message }) => message));
        }
    }
});
app.post("/signin", (req, res) => {
    console.log("signin");
    const { username, password } = req.body;
    const isExist = USERS === null || USERS === void 0 ? void 0 : USERS.some((user) => (user === null || user === void 0 ? void 0 : user.username) === username);
    if (isExist) {
        res.status(409).send({ message: "User already Exist" });
    }
    else {
        let newUser = {
            username,
            password,
            isActive: true,
            todos: []
        };
        USERS = [...USERS, newUser];
        const token = jwt.sign({ username, password }, secret);
        res.status(200).send({ message: "User has been registered successfully", token });
    }
});
app.get("/todos", authenticateUser, (req, res) => {
    console.log("user");
    const { user } = req;
    console.log("user", user);
    res.status(200).send({ data: user.todos });
});
app.get("/todos/:id", authenticateUser, (req, res) => {
    const { id } = req.params;
    const { user } = req;
    let todo = user.todos.find(ele => ele.id === id);
    if (todo) {
        res.status(200).send({ data: todo });
    }
    {
        res.status(200).send({ message: "No Todo for this id" });
    }
});
app.post("/todo", authenticateUser, (req, res) => {
    const reqBody = req.body;
    const { user } = req;
    let newTodo = {
        title: reqBody.title,
        description: reqBody.description,
        id: (0, uuid_1.v4)()
    };
    const updatedUserTodo = [...user.todos, newTodo];
    USERS.forEach(item => {
        if (item.username === user.username) {
            item.todos = updatedUserTodo;
        }
        return item;
    });
    res.status(200).send({ data: newTodo, message: "Todo added successfully" });
});
app.delete("/todo/:id", authenticateUser, (req, res) => {
    var _a;
    const { id } = req.params;
    const { user } = req;
    let todos = (_a = user.todos) === null || _a === void 0 ? void 0 : _a.filter((todo) => todo.id !== id);
    USERS.forEach(item => {
        if (item.username === user.username) {
            item.todos = todos;
        }
        return item;
    });
    res.send("todo deleted successfully");
});
app.listen(port, () => console.log("listening on", port));
