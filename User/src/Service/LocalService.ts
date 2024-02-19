import { v4 } from "uuid";
import User from "../Model/User";
import Service from "./Service";

interface LocalUser extends User {
  id: string;
}

export default class LocalService implements Service {
  users: LocalUser[];
  constructor() {
    this.users = [];
  }
  findUser(name: string): string | undefined {
    const found = this.users.find((user) => user.name === name);
    return found ? found.id : undefined;
  }
  saveUser(user: User): string {
    const id = v4();
    this.users.push({id,...user});
    return id;
  }
}
