import request from "supertest";
import { app } from "../app";

let token:String; 
let testTodo = {
    title:"Test",
    description:"Test Product 1"
};
let testTodoId:String;

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

        describe("Given user is Logged in ",()=>{
            it("should return the all todos", async ()=>{
               const response = await request(app)
                    .get("/todos")
                    .set("Authorization", 'Bearer ' + token)
                    .expect('Content-Type', /json/)
                    .expect(200);
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
        describe("Given user is not logged in ",()=>{
            it("should return the 401",async ()=>{
                const response = await request(app)
                    .get("/todos")
                    .expect('Content-Type', /json/)
                    .expect(401);
                expect(response.body.statusCode).toBe(401)
                expect(response.body.message).toBe("Unauthorized");
            })
        })

    })  

    describe("GET /todos/:id",()=>{

        describe("Given the todo does not exists",()=>{
            it("should return a 404 Not Found",async()=>{
                let todoId = "adasfrea"
                const response = await request(app)
                    .get(`/todos/${todoId}`)
                    .set("Authorization", 'Bearer ' + token)
                    .expect('Content-Type', /json/)
                    .expect(400)
                expect(response.body.statusCode).toBe(400)
                expect(response.body.message).toBe("404 Not Found")

            })
        })

        describe("Given the todo exists",()=>{
            beforeEach(async()=>{
                const response = await request(app)
                    .post("/todo")
                    .set("Authorization", 'Bearer ' + token)
                    .send(testTodo)
                    .expect(200)
                    testTodoId = response.body.data.id;
            })

            it("should return the todo",async()=>{
                const response = await request(app)
                    .get(`/todos/${testTodoId}`)
                    .set("Authorization", 'Bearer ' + token)
                    .expect('Content-Type', /json/)
                    .expect(200)
                expect(response.body.statusCode).toBe(200);
                expect(response.body.data).toEqual(expect.objectContaining({
                    id:expect.any(String),
                    title:expect.any(String),
                    description:expect.any(String)
                }))
            })
        })

    })

    describe("POST /todo",()=>{
        describe("Given the new Todo",()=>{
            it("should return the new todo",async()=>{
                const response = await request(app)
                    .post("/todo")
                    .set("Authorization", 'Bearer ' + token)
                    .send(testTodo)
                    .expect('Content-Type', /json/)
                    .expect(200)
                expect(response.body.statusCode).toBe(200);
                expect(response.body.message).toBe("Todo created successfully");
                expect(response.body.data).toEqual(expect.objectContaining({
                    title:testTodo.title,
                    description:testTodo.description,
                    id:expect.any(String)
                }));
                    
            })
        })

        describe("Given the Invalid payload Todo",()=>{
            it("should return the 400 Bad Request",async()=>{
                const response = await request(app)
                    .post("/todo")
                    .set("Authorization", 'Bearer ' + token)
                    .send({title:""})
                    .expect('Content-Type', /json/)
                    .expect(400)
                expect(response.body.statusCode).toBe(400);
                expect(response.body.message).toBe("400 Bad Request");
            })
        })
    })

    describe("DELETE /todo/:id",()=>{

        describe("Given the Invalid Todo id",()=>{
            it("should return the 400 Bad Request",async()=>{
                let randomId ="aweq"
                const response = await request(app)
                    .delete(`/todo/${randomId}`)
                    .set("Authorization", 'Bearer ' + token)
                    .expect('Content-Type', /json/)
                    .expect(400)
                expect(response.body.statusCode).toBe(400);
                expect(response.body.message).toBe("400 Bad Request");
            })
        })
        describe("Given the Todo id ",()=>{
            beforeEach(async()=>{
                const response = await request(app)
                    .post("/todo")
                    .set("Authorization", 'Bearer ' + token)
                    .send(testTodo)
                    .expect(200)
                    testTodoId = response.body.data.id;
            })
            it("should delete the todo",async()=>{
                const response = await request(app)
                    .delete(`/todo/${testTodoId}`)
                    .set("Authorization", 'Bearer ' + token)
                    .expect('Content-Type', /json/)
                    .expect(200)
                expect(response.body.statusCode).toBe(200);
                expect(response.body.data).toEqual(expect.objectContaining({
                    id:testTodoId,
                    message:"Todo deleted successfully"
                })) 
            })
        })
    })
})