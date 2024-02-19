import { readFile } from "fs/promises";
import Config from "./Config";

const readConfigFile = async (path: string): Promise<Config> =>
  readFile(path)
    .then((data) => data.toString())
    .then((data) => JSON.parse(data))
    .then((config) => {
      const hostname = config.HOST;
      if (!hostname) {
        return Promise.reject(new Error("No HOST in config file"));
      }
      if (typeof hostname !== "string") {
        return Promise.reject(new Error("HOST is not a string"));
      }
      const portStr = config.PORT;
      if (!portStr) {
        return Promise.reject(new Error("No PORT in config file"));
      }
      const port = parseInt(portStr);
      if (!Number.isInteger(port)) {
        return Promise.reject(new Error("PORT is not an integer"));
      }
      return { hostname, port };
    });
export default readConfigFile;