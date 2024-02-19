import { v4 } from "uuid";
import User from "../Model/User";
import Service, { UserID } from "./Service";

interface LocalUser extends User {
  id: string;
}

export const notFound = "not-found";
export const notImplemented = "not-impl";

export default class LocalService implements Service {
  users: LocalUser[];
  constructor() {
    this.users = [];
  }
  verifyUser(_: string, __: string): Promise<boolean> {
    return Promise.reject(notImplemented)
  }
  update(name: string, password: string): Promise<void> {
    return this.getUser(name).then((user) => {
      user.password = password;
    });
  }
  removeUser(id: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index < 0) {
      return Promise.reject(notFound);
    }
    this.users.splice(index, 1);
    return Promise.resolve();
  }
  getUser(name: string): Promise<User> {
    const found = this.users.find((user) => user.name === name);
    return found ? Promise.resolve(found) : Promise.reject(notFound);
  }
  findUser(name: string): Promise<UserID> {
    const found = this.users.find((user) => user.name === name);
    return found ? Promise.resolve(found.id) : Promise.reject(notFound);
  }
  saveUser(user: User): Promise<UserID> {
    const id = v4();
    this.users.push({ id, ...user });
    return Promise.resolve(id);
  }
}
