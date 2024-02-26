import express, { json } from "express";
import getConfig from "./Config/getConfig";
import { exit } from "process";
import MongoDBService from "./Service/MongoDBService";
import link from "./Routes/link";

(async () =>
  getConfig()
    .then((config) => {
      const service = new MongoDBService(config.databaseHost, "bookmarks", "links");
      const app = express();
      app.use(json());
      
      app.use("/link",link(service));
      //app.use("/user", user(service));

      app.listen(config.port, "0.0.0.0", () =>
        console.log(`listening on port ${config.port}`),
      );
    })
    .catch((reason) => {
      console.error(reason);
      exit(1);
    }))();
