import request from "supertest";
import { app } from "../app";
import { error } from "console";


describe("All Todos Route",()=>{

 

    describe("GET /todos",()=>{
        it("should return the all todos", (done)=>{
           request(app)
            .get("/todos")
            .expect("Authorization","afsdffsfgfgdf")
            .expect(200)
            .end((err,res) => {
                if(err) return done(err);
                console.log("res",res.body);
                return done();
            })
            
         
        })
    })  
})