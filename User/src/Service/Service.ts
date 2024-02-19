import User from "../Model/User";

export type UserID = string ;
export default interface Service{
    findUser(name:string):UserID|undefined;
    getUser(name:string):User|undefined;
    saveUser(user:User):UserID;
    removeUser(id:UserID):boolean;
    update(name:string,password:string):boolean;
}