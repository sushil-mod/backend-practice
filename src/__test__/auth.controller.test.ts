import request from "supertest"
import { app } from "../app"


describe("All Authentication Route",()=>{
    let currentUser = { username:"sushil",password:"sushil@123"}
  
    describe("POST /login",()=>{
        
        describe("Given User not Exists",()=>{
            it("should return Inavlid Credential",async ()=>{
               const response = await request(app)
                    .post("/login")
                    .send({ username:"susshil",password:"sushil@11223"})
                    .expect('Content-Type', /json/)
                    .expect(401)
                expect(response.body.statusCode).toBe(401)
                expect(response.body.message).toBe("Unauthorized")
            })
        })
        describe("Given User wrong password",()=>{
            it("should return Inavlid Credential",async ()=>{
               const response = await request(app)
                    .post("/login")
                    .send({ username:"sushil",password:"sushil@11223"})
                    .expect('Content-Type', /json/)
                    .expect(401)
                expect(response.body.statusCode).toBe(401)
                expect(response.body.message).toBe("Unauthorized")
            })
        })

        describe("Given User Exists",()=>{
            it("should return user with status 200",async()=>{
                const response = await request(app)
                    .post("/login")
                    .send(currentUser)
                    .expect('Content-Type', /json/)
                    .expect(200)
                expect(response.body.statusCode).toBe(200)
                expect(response.body.token).toEqual(expect.any(String));
                expect(response.body.data).toEqual(expect.objectContaining({
                    username:currentUser.username,
                    isActive:expect.any(Boolean)
                }))
            })
        })
    })

    describe("POST /signin",()=>{
        let newUser = { username:"newUser",password:"sushil@123"}
        describe("Given Invalid Payload",()=>{
            it("should return Invalid Payload",async()=>{
                const response = await request(app)
                    .post("/signin")
                    .send({username:""})
                    .expect('Content-Type', /json/)
                    .expect(400)
                expect(response.body.statusCode).toBe(400)
                expect(response.body.message).toBe("Bad Request")
            })
        })

        describe("Given user already exists",()=>{
            it("should return user already exists",async()=>{
                const response = await request(app)
                    .post("/signin")
                    .send(currentUser)
                    .expect('Content-Type', /json/)
                    .expect(409)
                expect(response.body.statusCode).toBe(409);
                expect(response.body.message).toBe("User already exists");
            })
        })

        describe("Given New user Payload",()=>{
            it("should create new user and return user detail",async()=>{
                const response = await request(app)
                    .post("/signin")
                    .send(newUser)
                    .expect('Content-Type', /json/)
                    .expect(200)
                expect(response.body.statusCode).toBe(200);
                expect(response.body.message).toBe("User created successfully");
                expect(response.body.token).toEqual(expect.any(String));
                expect(response.body.data).toEqual(expect.objectContaining({
                    username:newUser.username,
                    isActive:expect.any(Boolean)
                }))

            })
        })
    })

})