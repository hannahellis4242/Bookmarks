import express from "express";
import getConfig from "./Config/getConfig";
import { exit } from "process";

(async () =>
  getConfig().then((config) => {
    const app = express();

    app.listen(config.port, "0.0.0.0", () =>
      console.log(`listening on port ${config.port}`)
    );
  }).catch((reason)=>{
    console.error(reason);
    exit(1);
  })
  )();
