import request from "supertest";
import { app } from "../app";
import { string } from "zod";

let token:String 

    beforeAll( (done)=>{
        request(app)
            .post("/login")
            .send({  username:"sushil",password:"sushil@123"})
            .expect(200)
            .end((err,res) => {
                if(err) return done(err);
                token = res.body.token;
                return done();
            })
    })

describe("All Todos Route",()=>{

    describe("GET /todos",()=>{
        it("should return the all todos", async ()=>{
           const response = await request(app)
                .get("/todos")
                .set("Authorization", 'Bearer ' + token)
                .expect('Content-Type', /json/)
                .expect(200);
                console.log("response",response.body)
            expect(response.body.statusCode).toBe(200);
            expect(response.body.data).toEqual(expect.any(Array));
            if(response.body.data.length > 0) {
                expect(response.body.data).toEqual(expect.arrayContaining([expect.objectContaining({
                    id:expect.any(String),
                    title:expect.any(String),
                    description:expect.any(String)
                })]))
            }
        })
    })  
})