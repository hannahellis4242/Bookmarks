import { RequestHandler } from "express";
import queryDB from "../utils/queryDB";
import Result from "../utils/Result";
interface LinkInfo {
  id: number;
  user: string;
  tag: string;
}

const getTagInfoForLink = (link: string): Result<LinkInfo[], Error> => {
  return queryDB(`select bookmark.id, user.name as user , tag.label as tag
  from bookmark 
  inner join user on user.id=bookmark.user
  inner join tag on tag.id=bookmark.tag
  where link=(select link.id from link where link.url='${link}')`).map(
    (data) => data as LinkInfo[]
  );
};

const tagInfoHandler: RequestHandler = (req, res) => {
  if (req.query.link) {
    //wish to find the tags for a particular link
  }
};

export default tagInfoHandler;
