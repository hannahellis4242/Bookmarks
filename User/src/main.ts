import express, { json } from "express";
import getConfig from "./Config/getConfig";
import { exit } from "process";
(async () =>
  getConfig().then((config) => {
    const app = express();
    app.use(json());

    app.listen(config.port, config.hostname, () =>
      console.log(`listening on ${config.hostname}:${config.port}`)
    );
  }).catch((reason)=>{
    console.error(reason);
    exit(1);
  })
  )();
