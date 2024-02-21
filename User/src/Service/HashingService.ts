import { compare, hash } from "bcrypt";
import User from "../Model/User";
import Service, { UserID } from "./Service";

export default class HashingService implements Service {
  constructor(private wrapped: Service) {}
  verifyUser(name: string, password: string): Promise<boolean> {
    return this.getUser(name).then((user) => compare(password, user.password));
  }
  findUser(name: string): Promise<UserID> {
    return this.wrapped.findUser(name);
  }
  getUser(name: string): Promise<User> {
    return this.wrapped.getUser(name);
  }
  saveUser({ name, password }: User): Promise<UserID> {
    return hash(password, 12).then((hashed) =>
      this.wrapped.saveUser({ name, password: hashed })
    );
  }
  removeUser(name: UserID): Promise<void> {
    return this.wrapped.removeUser(name);
  }
  update(name: string, password: string): Promise<void> {
    return hash(password, 12).then((hashed) => this.wrapped.update(name, hashed));
  }
}
