import { PathLike, readFile } from "fs";
import { promisify } from "util";
import { Express } from "express";
import { createServer } from "https";
import { OptionsPaths } from "./Configuration";

const read = promisify(readFile);

const readOptions = async (keyPath: PathLike, certPath: PathLike) => {
  return read(keyPath).then((key) =>
    read(certPath).then((cert) => {
      return {
        key,
        cert,
      };
    })
  );
};

export const createHTTPSServer = async (
  optionsPaths: { key: PathLike; cert: PathLike },
  app: Express
) => {
  const options = await readOptions(optionsPaths.key, optionsPaths.cert);
  return createServer(options, app);
};

export const runHTTPSServer = async (
  app: Express,
  options: OptionsPaths,
  port: number,
  callback?: () => void
) => {
  const server = await createHTTPSServer(options, app).then((server) =>
    server.listen(port, callback)
  );
  const safeClose = async () => {
    console.log("Closing https server.");
    server.close(() => console.log("HTTPS sever closed"));
  };
  process.on("SIGTERM", () => {
    console.info("SIGTERM signal received.");
    safeClose();
  });
  process.on("SIGINT", () => {
    console.info("SIGINT signal received.");
    safeClose();
  });
  process.on("SIGQUIT", () => {
    console.info("SIGQUIT signal received.");
    safeClose();
  });
};
