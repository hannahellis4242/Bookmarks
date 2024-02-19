import User from "../Model/User";

export type UserID = string ;
export default interface Service{
    findUser(name:string):Promise<UserID>;
    getUser(name:string):Promise<User>;
    verifyUser(name:string,password:string):Promise<boolean>;
    saveUser(user:User):Promise<UserID>;
    removeUser(id:UserID):Promise<void>;
    update(name:string,password:string):Promise<void>;
}