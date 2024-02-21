import { v4 } from "uuid";
import User from "../Model/User";
import Service, { ServiceErrors, UserID } from "./Service";

interface LocalUser extends User {
  id: string;
}

export default class LocalService implements Service {
  users: LocalUser[];
  constructor() {
    this.users = [];
  }
  verifyUser(_: string, __: string): Promise<boolean> {
    return Promise.reject(ServiceErrors.NotImpl);
  }
  update(name: string, password: string): Promise<void> {
    return this.getUser(name).then((user) => {
      user.password = password;
    });
  }
  removeUser(id: UserID): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id.value);
    if (index < 0) {
      return Promise.reject(ServiceErrors.NotFound);
    }
    this.users.splice(index, 1);
    return Promise.resolve();
  }
  getUser(name: string): Promise<User> {
    const found = this.users.find((user) => user.name === name);
    return found
      ? Promise.resolve(found)
      : Promise.reject(ServiceErrors.NotFound);
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
