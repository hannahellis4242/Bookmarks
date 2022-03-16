import { RequestHandler } from "express";
import queryDB from "../utils/queryDB";
import Result from "../utils/Result";
interface LinkInfo {
  id: number;
  user: string;
  tag: string;
}

const queryForLink = (link: string) => {
  return `select bookmark.id, user.name as user , tag.label as tag
  from bookmark 
  inner join user on user.id=bookmark.user
  inner join tag on tag.id=bookmark.tag
  where link=(select link.id from link where link.url='${link}')`;
};

const queryForUser = (name: string) => {
  return `select  bookmark.id,link.url as link,tag.label as tag from bookmark
  inner join link on bookmark.link = link.id
  inner join tag on bookmark.tag = tag.id
  where bookmark.user = (select (id) from user where user.name = '${name}')`;
};

const tagInfoHandler: RequestHandler = (req, res) => {
  if (req.query.link) {
    //wish to find the tags for a particular link
    queryDB(queryForLink(req.query.link.toString()))
      .then((results) => res.status(200).json(results))
      .catch((err) => res.status(500).json(err));
  } else if (req.query.user) {
    //wish to find the tags for a particular user
    queryDB(queryForUser(req.query.user.toString()))
      .then((results) => res.status(200).json(results))
      .catch((err) => res.status(500).json(err));
  } else {
    res.status(500).json({ err: "no query" });
  }
};

export default tagInfoHandler;
