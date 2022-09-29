import express from "express";
import { join } from "path";
import { runSecure } from "./runSecure";

const httpPort = 3000;
const httpsPort = 3001;

const app = express();
app.get("/", (req, res) => {
  res.status(200).send("hello world");
});
runSecure(app, {
  ports: { secure: 3001, open: 3000 },
  options: {
    key: join(__dirname, "..", "..", "certs", "key.pem"),
    cert: join(__dirname, "..", "..", "certs", "cert.pem"),
  },
});
