import { Request, Response, Router } from "express";
import User, { UserSchema } from "../Model/User";
import Service, { ServiceErrors } from "../Service/Service";
import { StatusCodes } from "http-status-codes";

class ParseError {
  constructor(public message: string) {}
}
const Errors = {
  NoAuth: "NoAuth",
  NoName: "NoName",
  NoPass: "NoPass",
  NoUpdatePassword: "NoUpdatePassword",
  NotVerified: "NotVerified",
  Conflict: "Conflict",
} as const;

type Errors = ServiceErrors | (typeof Errors)[keyof typeof Errors] | ParseError;

const handleError = (e: Errors, res: Response) => {
  switch (e) {
    case Errors.NoAuth:
    case Errors.NoName:
    case Errors.NoPass:
    case Errors.NoUpdatePassword:
      res.sendStatus(StatusCodes.BAD_REQUEST);
      return;
    case Errors.NotVerified:
      res.sendStatus(StatusCodes.UNAUTHORIZED);
    case ServiceErrors.NotFound:
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    case ServiceErrors.NotImpl:
      res.sendStatus(StatusCodes.NOT_IMPLEMENTED);
      return;
  }
  if (e instanceof ParseError) {
    res.status(StatusCodes.BAD_REQUEST).send(e.message);
  }
};

const user = (service: Service) => {
  const getAuthHeader = (req: Request): Promise<User> => {
    const auth = req.headers.authorization;
    if (!auth) {
      return Promise.reject(Errors.NoAuth);
    }
    const [name, password] = Buffer.from(auth.slice(6), "base64")
      .toString()
      .split(":");
    if (!name) {
      return Promise.reject(Errors.NoName);
    }
    if (!password) {
      return Promise.reject(Errors.NoPass);
    }
    return Promise.resolve({ name, password });
  };

  const verify = (req: Request): Promise<string> =>
    getAuthHeader(req)
      .then(({ name, password }) =>
        service
          .verifyUser(name, password)
          .then((isVerified) => ({ name, isVerified }))
      )
      .then(({ name, isVerified }) =>
        isVerified ? Promise.resolve(name) : Promise.reject(Errors.NotVerified)
      );

  const parseBody = (req: Request) => {
    const body = UserSchema.safeParse(req.body);
    if (!body.success) {
      return Promise.reject(
        new ParseError(
          body.error.issues
            .map(({ path, message }) => `${path} : ${message}`)
            .join("\n")
        )
      );
    }
    return Promise.resolve(body);
  };

  const route = Router();

  route.post("/", async (req, res) => {
    parseBody(req)
      .then(({ data }) =>
        service.getUser(data.name).then((id) => ({ id, ...data }))
      )
      .then(({ id, name, password }) =>
        id
          ? Promise.reject(Errors.Conflict)
          : service.saveUser({ name, password })
      )
      .then(() => res.sendStatus(StatusCodes.CREATED))
      .catch((error) => handleError(error, res));
  });

  route.get("/login", async (req, res) =>
    getAuthHeader(req)
      .then(({ name, password }) => service.verifyUser(name, password))
      .then((isVerified) => res.status(StatusCodes.OK).json({ isVerified }))
      .catch((e) => res.sendStatus(StatusCodes.BAD_REQUEST))
  );

  route.delete("/", async (req, res) =>
    verify(req)
      .then((name) => service.findUser(name))
      .then((userID) => service.removeUser(userID))
      .then(() => res.sendStatus(StatusCodes.OK))
      .catch((e) => handleError(e, res))
  );

  route.put("/", (req, res) =>
    verify(req)
      .then((name) => ({ name, password: req.body.password }))
      .then(({ name, password }) =>
        password
          ? Promise.resolve({ name, password })
          : Promise.reject(Errors.NoUpdatePassword)
      )
      .then(({ name, password }) => service.update(name, password))
      .then(() => res.sendStatus(StatusCodes.OK))
      .catch((e) => handleError(e, res))
  );
  return route;
};
export default user;
