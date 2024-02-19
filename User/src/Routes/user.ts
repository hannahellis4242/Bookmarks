import { Router } from "express";
import { UserSchema } from "../Model/User";
import Service from "../Service/Service";
import { StatusCodes } from "http-status-codes";

const user = (service: Service) => {
  const route = Router();
  route.post("/", async (req, res) => {
    const body = UserSchema.safeParse(req.body);
    if (!body.success) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send(
          body.error.issues
            .map(({ path, message }) => `${path} : ${message}`)
            .join("\n")
        );
      return;
    }
    const user = body.data;
    const found = service.findUser(user.name);
    if (found !== undefined) {
      res.status(StatusCodes.CONFLICT).send(found);
      return;
    }
    const id = service.saveUser(user);
    res.status(StatusCodes.CREATED).send(id);
  });
  return route;
};
export default user;
