import { Router } from "express";
import { UserSchema } from "../Model/User";
import Service from "../Service/Service";

const user = (service:Service) => {
  const route = Router();
  route.post("/", async (req, res) => {
    const body = UserSchema.safeParse(req.body);
    if (!body.success) {
      res
        .status(400)
        .send(
            body.error.issues
            .map(({path,message}) => `${path} : ${message}`)
            .join("\n")
        );
      return;
    }
    const user = body.data;
    service.findUser(user.name);
    service.saveUser(user);
  });
  return route;
};
export default user;
