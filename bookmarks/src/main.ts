import express from "express";
import cors from "cors";
import allHandler from "./handlers/allHandler";
import tagInfoHandler from "./handlers/tagInfoHandler";

const host = "0.0.0.0";
const port = 5000;
const app = express();

app.use(express.json());
app.get("/bookmarks", cors(), allHandler);
app.get("/tags", cors(), tagInfoHandler);

app.listen(port, host, () => {
  console.log(`listening at http://${host}:${port}`);
});
