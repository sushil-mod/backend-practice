
const express = require("express");
const bodyParser = require("body-parser");
const port =8000;

const app = express();

app.use(bodyParser.json());

let todos = []
let counter = 1;

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

