import express from "express";
import cors from "cors";
import allBookmarksHandler from "./handlers/allBookmarksHandler";
import tagInfoHandler from "./handlers/tagInfoHandler";
import allLinksHandler from "./handlers/allLinksHandler";

const host = "0.0.0.0";
const port = 5000;
const app = express();

app.use(express.json());
app.get("/bookmarks/all", cors(), allBookmarksHandler);
app.get("/tags", cors(), tagInfoHandler);
app.get("/links/all", cors(), allLinksHandler);

app.listen(port, host, () => {
  console.log(`listening at http://${host}:${port}`);
});
