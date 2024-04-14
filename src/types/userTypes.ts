
export interface Todo {
    id:string,
    title:string,
    description:string
}
  
export interface User {  
    username:string,
    password:string,
    isActive:boolean,
    todos:Todo[]
}


declare global {
    namespace Express{
        interface Request{
            user:User
        }
    }
}