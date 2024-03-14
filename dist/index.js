"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const jwt = require("jsonwebtoken");
let port = 8000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
let todos = [];
let counter = 1;
let USER = [];
let secret = "todoAppSceret";
const authenticateUser = (req, res, next) => {
    const authorization = req.headers['authorization'];
    const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[1];
    if (!token) {
        res.send({ message: "token not Found" });
    }
    jwt.verify(token, secret, (err, user) => {
        if (err) {
            res.send({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    });
};
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const isUser = USER === null || USER === void 0 ? void 0 : USER.some((user) => (user === null || user === void 0 ? void 0 : user.username) === username);
    if (isUser) {
        const user = USER === null || USER === void 0 ? void 0 : USER.find((user) => (user === null || user === void 0 ? void 0 : user.username) === username);
        if ((user === null || user === void 0 ? void 0 : user.password) === password) {
            const token = jwt.sign(req.body, secret);
            res.send({ message: "Logged in successfully", token });
        }
        res.send({ message: "Incorrect Password" });
    }
    else {
        res.send({ message: "Invalid Username" });
    }
});
app.post("/signin", (req, res) => {
    const { username, password } = req.body;
    const isExist = USER === null || USER === void 0 ? void 0 : USER.some((user) => (user === null || user === void 0 ? void 0 : user.username) === username);
    if (isExist) {
        res.send({ message: "User already Exist" });
    }
    else {
        USER = [...USER, { username, password, isActive: false }];
        const token = jwt.sign({ username, password }, secret);
        res.send({ message: "User has been registered successfully", token });
    }
});
app.get("/todos", authenticateUser, (req, res) => {
    res.send({ data: todos });
});
app.get("/todos/:id", authenticateUser, (req, res) => {
    const { id } = req.params;
    let resposne = todos === null || todos === void 0 ? void 0 : todos.find((todo) => (todo === null || todo === void 0 ? void 0 : todo.id) === id);
    res.send({ data: resposne });
});
app.post("/todo", authenticateUser, (req, res) => {
    const reqBody = req.body;
    let newTodo = Object.assign(Object.assign({}, reqBody), { id: counter });
    todos = [...todos, newTodo];
    counter++;
    res.send({ data: newTodo });
});
app.delete("/todo/:id", authenticateUser, (req, res) => {
    const { id } = req.query;
    todos = todos === null || todos === void 0 ? void 0 : todos.filter((todo) => (todo === null || todo === void 0 ? void 0 : todo.id) === id);
    res.send("todo deleted successfully");
});
app.listen(port, () => console.log("listening on", port));
