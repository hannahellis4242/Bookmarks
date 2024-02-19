import express, { json } from "express";
import getConfig from "./Config/getConfig";
import { exit } from "process";
import LocalService from "./Service/LocalService";
import user from "./Routes/user";
import HashingService from "./Service/HashingService";
(async () =>
  getConfig().then((config) => {
    const service = new LocalService();
    const hashingService = new HashingService(service);
    const app = express();
    app.use(json());

    app.use("/user",user(hashingService))

    app.listen(config.port, config.hostname, () =>
      console.log(`listening on ${config.hostname}:${config.port}`)
    );
  }).catch((reason)=>{
    console.error(reason);
    exit(1);
  })
  )();
