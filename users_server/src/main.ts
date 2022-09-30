import express from "express";
import { join } from "path";
import { runHTTPSServer } from "./server/createHTTPSSever";
import bcrypt from "bcrypt";

interface User {
  name: string;
  password: string;
}
interface Result<T> {
  success: boolean;
  reason?: string;
  data?: T;
}
const createSuccess = <T>(data: T): Result<T> => {
  return { success: true, data };
};
const createFail = (reason: string): Result<undefined> => {
  return { success: false, reason };
};
const users: User[] = [];
const app = express();

app.get("/users", (_, res) => {
  res.json(createSuccess(users));
});
app.post("/users", (req, res) => {
  const name = req.query.name;
  const password = req.query.password;
  if (name && password) {
    const contains = users.some((user) => user.name === name);
    if (contains) {
      res.json(createFail("user already exists"));
    } else {
      bcrypt.hash(password.toString(), 12, (err, hash) => {
        if (err) {
          res.json(createFail("hash fail : " + err.message));
        } else {
          users.push({ name: name.toString(), password: hash });
          res.json(createSuccess({ user: name }));
        }
      });
    }
  } else {
    res.json(createFail("invalid parameters"));
  }
});
app.get("/users/validate", async (req, res) => {
  const name = req.query.name;
  const password = req.query.password;
  if (name && password) {
    const entry = users.find((user) => user.name === name);
    if (entry) {
      const matches = await bcrypt.compare(password.toString(), entry.password);
      if (matches) {
        res.json(createSuccess({ user: name, valid: true }));
      } else {
        res.json(createFail("invalid user"));
      }
    } else {
      res.json(createFail("user does not exist"));
    }
  }
});
app.all("*", (_, res) => {
  res.status(404).send("not found");
});
const port = 3001;
runHTTPSServer(
  app,
  {
    key: join(__dirname, "..", "..", "certs", "key.pem"),
    cert: join(__dirname, "..", "..", "certs", "cert.pem"),
  },
  port,
  () => console.log("https server listening on", port)
);
