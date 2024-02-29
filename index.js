const express = require("express");
const port =8000;

const app = express();

app.get("/",(req,res)=>{
    res.send({name:"sushil",age:24});
})
app.get("/add",(req,res)=>{
    const {firstnum,secondnum} = req.query;
    console.log("number",firstnum,secondnum)
    let sum = Number(firstnum)+Number(secondnum);
    res.send({sum});
})
app.listen(port,()=>console.log("listening on",port));

