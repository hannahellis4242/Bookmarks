import { RequestHandler } from "express";
import queryDB from "../utils/queryDB";

const allLinksHandler: RequestHandler = (_, res) => {
  queryDB("select url from link order by url")
    .then((results) => res.status(200).json(results))
    .catch((err) => res.status(500).json(err));
};

export default allLinksHandler;
