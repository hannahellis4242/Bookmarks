import { v4 } from "uuid";
import User from "../Model/User";
import Service from "./Service";
import ServiceErrors from "./ServiceErrors";
import UserID from "./UserID";

interface LocalUser extends User {
  id: string;
}

export default class LocalService implements Service {
  users: LocalUser[];
  constructor() {
    this.users = [];
  }
  verifyUser(name: string, password: string): Promise<boolean> {
    const found = this.users.find((user) => user.name === name);
    if (!found) {
      return Promise.reject(ServiceErrors.NotFound);
    }
    return Promise.resolve(found.password === password);
  }
  update(name: string, password: string): Promise<void> {
    const found = this.users.find((user) => user.name === name);
    if (!found) {
      return Promise.reject(ServiceErrors.NotFound);
    }
    found.password = password;
    return Promise.resolve();
  }
  removeUser(id: UserID): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id.value);
    if (index < 0) {
      return Promise.reject(ServiceErrors.NotFound);
    }
    this.users.splice(index, 1);
    return Promise.resolve();
  }
  findUser(name: string): Promise<UserID> {
    const found = this.users.find((user) => user.name === name);
    return found
      ? Promise.resolve({ t: "user", value: found.id })
      : Promise.reject(ServiceErrors.NotFound);
  }
  saveUser(user: User): Promise<UserID> {
    const id = v4();
    this.users.push({ id, ...user });
    return Promise.resolve({ t: "user", value: id });
  }
}
