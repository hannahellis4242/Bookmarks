import User from "../Model/User";

export default interface Service{
    findUser(name:string):string|undefined;
    saveUser(user:User):string;
}