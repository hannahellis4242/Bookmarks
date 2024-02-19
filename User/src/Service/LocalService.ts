import { v4 } from "uuid";
import User from "../Model/User";
import Service, { UserID } from "./Service";

interface LocalUser extends User {
  id: string;
}

export default class LocalService implements Service {
  users: LocalUser[];
  constructor() {
    this.users = [];
  }
    update(name: string, password: string): boolean {
        const user = this.getUser(name);
        if(!user){
            return false;
        }
        user.password = password;
        return true ;
    }
  removeUser(id: string): boolean {
    const index = this.users.findIndex((user) => user.id === id);
    if (index < 0) {
      return false;
    }
    this.users.splice(index, 1);
    return true;
  }
  getUser(name: string): User | undefined {
    return this.users.find((user) => user.name === name);
  }
  findUser(name: string): UserID | undefined {
    const found = this.users.find((user) => user.name === name);
    return found ? found.id : undefined;
  }
  saveUser(user: User): UserID {
    const id = v4();
    this.users.push({ id, ...user });
    return id;
  }
}
