import { RequestHandler } from "express";
import queryDB from "../utils/queryDB";

const allHandler: RequestHandler = (_, res) => {
  queryDB(
    "select bookmark.id, link.url as link, tag.label as tag,user.name as user from bookmark inner join link on bookmark.link = link.id inner join tag on bookmark.tag = tag.id inner join user on bookmark.user = user.id"
  )
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });
};

export default allHandler;
