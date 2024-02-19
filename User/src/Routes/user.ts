import { Request, Router } from "express";
import User, { UserSchema } from "../Model/User";
import Service from "../Service/Service";
import { StatusCodes } from "http-status-codes";
import { notFound } from "../Service/LocalService";

const user = (service: Service) => {
  const getAuthHeader = (req: Request): Promise<User> => {
    const auth = req.headers.authorization;
    if (!auth) {
      return Promise.reject(notFound);
    }
    const [name, password] = Buffer.from(auth.slice(6), "base64")
      .toString()
      .split(":");
    if (!name) {
      return Promise.reject(notFound);
    }
    if (!password) {
      return Promise.reject(notFound);
    }
    return Promise.resolve({ name, password });
  };

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
    try {
      await service.findUser(user.name);
      res.sendStatus(StatusCodes.CONFLICT);
    } catch (e) {
      if (e === notFound) {
        await service.saveUser(user);
        res.sendStatus(StatusCodes.CREATED);
      }
    }
  });

  route.get("/login", async (req, res) => {
    const user = getAuthHeader(req);
    if (!user) {
      res.sendStatus(StatusCodes.BAD_REQUEST);
      return;
    }
    res
      .status(StatusCodes.OK)
      .json({ success: await service.verifyUser(user.name, user.password) });
  });

  route.delete("/", async (req, res) => {
    const user = getAuthHeader(req).catch(()=>res.sendStatus(StatusCodes.BAD_REQUEST))
    .then(({name,password})=>service.verifyUser(name,password))
    const verified = await service.verifyUser(user.name, user.password);
    if (!verified) {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
      return;
    }
    await service
      .findUser(user.name)
      .then((userID) => service.removeUser(userID))
      .then(() => res.sendStatus(StatusCodes.OK))
      .catch((e) => {
        res.sendStatus(StatusCodes.NOT_FOUND);
      });
  });

  route.put("/", (req, res) => {
    const user = getAuthHeader(req);
    if (!user) {
      res.sendStatus(StatusCodes.BAD_REQUEST);
      return;
    }
    if (!verifyUser(user)) {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
      return;
    }
    const { password } = req.body;
    if (!password) {
      res.sendStatus(StatusCodes.BAD_REQUEST);
      return;
    }
    const success = service.update(user.name, password);
    if (!success) {
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    }
    res.sendStatus(StatusCodes.OK);
  });

  return route;
};
export default user;
