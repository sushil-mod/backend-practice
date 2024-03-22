import {z} from "zod";

export const userLoginSchema = z.object({
    username:z.string().min(1,"Username is required"),
    password:z.string().min(5,"Password must have atleast 5 character")

})