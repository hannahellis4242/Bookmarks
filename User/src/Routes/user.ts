import { Request, Router } from "express";
import User, { UserSchema } from "../Model/User";
import Service from "../Service/Service";
import { StatusCodes } from "http-status-codes";

const user = (service: Service) => {
  const getAuthHeader = (req: Request): User | undefined => {
    const auth = req.headers.authorization;
    if (!auth) {
      return undefined;
    }
    const [name, password] = Buffer.from(auth.slice(6), 'base64').toString().split(":");
    if (!name) {
      return undefined;
    }
    if (!password) {
      return undefined;
    }
    return { name, password };
  };

  const verifyUser = (user: User): boolean => {
    const userData = service.getUser(user.name);
    if (!userData) {
      return false;
    }
    if (userData.password !== user.password) {
      return false;
    }
    return true;
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
    const found = service.findUser(user.name);
    if (found !== undefined) {
      res.sendStatus(StatusCodes.CONFLICT);
      return;
    }
    const id = service.saveUser(user);
    res.sendStatus(StatusCodes.CREATED);
  });

  route.get("/login", async (req, res) => {
    const user = getAuthHeader(req);
    if (!user) {
      res.sendStatus(StatusCodes.BAD_REQUEST);
      return;
    }
    res.status(StatusCodes.OK).json({ success: verifyUser(user) });
  });

  route.delete("/", (req, res) => {
    const user = getAuthHeader(req);
    if (!user) {
      res.sendStatus(StatusCodes.BAD_REQUEST);
      return;
    }
    if(!verifyUser(user)){
      res.sendStatus(StatusCodes.UNAUTHORIZED);
      return ;
    }
    const userID = service.findUser(user.name);
    if (!userID) {
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    }
    const success = service.removeUser(userID);
    if (!success) {
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    }
    res.sendStatus(StatusCodes.OK);
  });

route.put("/",(req,res)=>{
  const user = getAuthHeader(req);
  if (!user) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }
  if(!verifyUser(user)){
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return ;
  }
  const {password} = req.body;
  if(!password){
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }
  const success = service.update(user.name,password);
  if (!success) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }
  res.sendStatus(StatusCodes.OK);
})


  return route;
};
export default user;
