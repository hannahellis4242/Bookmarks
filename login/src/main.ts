import express from "express";
import { join } from "path";
import { runHTTPSServer } from "./server/createHTTPSSever";
import { runWithRedirect } from "./server/runWithRedirect";

interface User {
  name: string;
  password: string;
}
const users: User[] = [];
const app = express();

app.get("/users", (_, res) => {
  res.json(users);
});
app.post("/users", (req, res) => {
  const name = req.query.name;
  const password = req.query.password;
  console.log(name, ",", password);
  if (name && password) {
    const contains = users.some((user) => user.name === name);
    if (contains) {
      res.json({ success: false, reason: "user already exists" });
    } else {
      users.push({ name: name.toString(), password: password.toString() });
      res.json({ success: true, user: name });
    }
  } else {
    res.json({ success: false, reason: "invalid body" });
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
