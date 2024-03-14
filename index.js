
const express = require("express");
const bodyParser = require("body-parser");
const port =8000;

const app = express();

app.use(bodyParser.json());

let todos = []
let counter = 1;
let USER = [];
let CART = [];

app.post("/login",(req,res)=>{
    const { username , password } = req.body;
    const isUser = USER?.some((user) => user?.username === username);
    if(isUser){
        const user = USER?.find((user) => user?.username === username);
        if(user?.password === password){
            res.send({message:"Logged in successfully"});
        } 
        res.send({message:"Incorrect Password"})

    }else{
        res.send({message:"Invalid Username"});
    }
});

app.post("/signin",(req,res)=>{
    const {username,password} = req.body;
    const isExist = USER?.some((user) => user?.username === username);
    if(isExist){
        res.send({message:"User already Exist"})
    }else{
        USER = [...USER,{username,password}];
        res.send({message:"User has been registered successfully"});
    }
});

app.get("/todos",(req,res)=>{
    res.send({data:todos});
})
app.get("/todos/:id",(req,res)=>{
    const {id} = req.params;
    console.log("get /todo/:id",id);
    let resposne = todos?.find((todo) => todo?.id === Number(id) )
    res.send({data:resposne});

})
app.post("/todo",(req,res)=>{
    const reqBody = req.body;
    console.log("post /todo",reqBody);
    let newTodo = {id:counter,...reqBody};
    todos = [...todos,newTodo];
    counter++ ;
    res.send({data:newTodo});
})

app.delete("/todo/:id",(req,res)=>{
    const {id} = req.query;
    console.log("delete /todo/:id",reqBody);
    todos = todos?.filter((todo) =>todo?.id === id);
    res.send("todo deleted successfully");
})

app.listen(port,()=>console.log("listening on",port));

