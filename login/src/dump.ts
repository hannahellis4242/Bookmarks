//place to dump old code
/*import express from "express";
import { readFile, readFileSync } from "fs";
import https from "https";
import http from "http";
import { join } from "path";
import { exit } from "process"; 

/*
readFile(join(__dirname, "..", "..", "certs", "key.pem"), async (err, key) => {
  if (err) {
    console.error("could not read key file : ", err.message);
    exit(1);
  }
  readFile(
    join(__dirname, "..", "..", "certs", "cert.pem"),
    async (err, cert) => {
      if (err) {
        console.error("could not read certificate : ", err.message);
        exit(1);
      }
      const options = { key, cert };
      const port = 3000;

      //redirect
      createRedirectServer(port).then((app) => {
        app.listen(port, () => {
          console.log("redirect listening on port", port);
        });
      });
      /*const server = createServer(options, app);
    server.listen(port, () => {
      console.log("server starting on port : " + port);
    });*/
/*
    }
  );
});

const createRedirectServer = async (port: number) => {
  const app = express();
  app.get("/", (req, res) => {
    console.log(req.url);
    res.redirect("google.com");
  });
  return app;
};*/

/*import { MongoClient, Db } from "mongodb";

const client = new MongoClient("mongodb://localhost:5001/test");
const start = async () => {
  await client.connect();
  const database = client.db("users");
  const app = express();
  app.get("/validate", async (req, res) => {
    if (req.query.user && req.query.password) {
      //go to the database to find user
      res.send(200).json({
        valid: true,
        email: "some.email@example.com",
        username: "user1",
      });
    }
    res.json({ valid: false, reason: "query malformed" });
  });
  app.post("/", (req, res) => {});
  const server = app.listen(3001, () => {
    console.log("user sever ready");
  });

  process.on("SIGTERM", async () => {
    console.info("SIGTERM signal received.");
    console.log("Closing http server.");
    server.close(() => {
      console.log("Http server closed.");
    });
    await client.close();
    console.log("closing database connection");
  });
};
start();
*/
