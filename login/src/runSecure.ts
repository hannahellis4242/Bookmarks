import express, { Express } from "express";
import { PathLike, readFile } from "fs";
import https from "https";
import { promisify } from "util";

const createRedirectSever = async (redirectPort: number) => {
  const server = express();
  server.all("*", (req, res) => {
    res.redirect("https://" + req.hostname + ":" + redirectPort + req.url);
  });
  return server;
};

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

const createHTTPSServer = async (
  options: { key: PathLike; cert: PathLike },
  app: Express
) => {
  return readOptions(options.key, options.cert).then((options) =>
    https.createServer(options, app)
  );
};

export const runSecure = async (
  app: Express,
  config: {
    ports: { secure: number; open: number };
    options: { key: PathLike; cert: PathLike };
  }
) => {
  const redirect = await createRedirectSever(config.ports.secure).then(
    (server) => server.listen(config.ports.open)
  );
  const server = await createHTTPSServer(config.options, app).then((server) =>
    server.listen(config.ports.secure)
  );
  const safeClose = async () => {
    console.log("Closing http server.");
    redirect.close(() => console.log("HTTP server closed."));
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
