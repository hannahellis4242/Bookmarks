import express, { json } from "express";
import getConfig from "./Config/getConfig";
import { exit } from "process";
import LocalService from "./Service/LocalService";
import user from "./Routes/user";
import MongoDBService from "./Service/MongoDBService";
(async () =>
  getConfig().then((config) => {
    const service = new MongoDBService(config.databaseHost,"users","users");
    const app = express();
    app.use(json());

    app.use("/user",user(service))

    app.listen(config.port, config.hostname, () =>
      console.log(`listening on ${config.hostname}:${config.port}`)
    );
  }).catch((reason)=>{
    console.error(reason);
    exit(1);
  })
  )();
