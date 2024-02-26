import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import ServiceErrors from "../Service/ServiceErrors";
import LinkService from "../Service/LinkService";
import readBody from "./utils/readBody";
import readQuery from "./utils/readQuery";

const Errors = {
  NoURL: "NoURL",
} as const;

type Errors = ServiceErrors | (typeof Errors)[keyof typeof Errors];

const handleError = (res: Response) => (e: Errors) => {
  switch (e) {
    case Errors.NoURL:
      return res.status(StatusCodes.BAD_REQUEST).send("No url in body");
    case ServiceErrors.AlreadyExists:
      return res.sendStatus(StatusCodes.CONFLICT);
    case ServiceErrors.NotFound:
      return res.sendStatus(StatusCodes.NOT_FOUND);
  }
  console.error("Error not handled : ", e);
  throw Error("unhandled error");
};

const link = (service: LinkService) =>
  Router()
    .post("/", (req, res) =>
      readBody(req, "url", Errors.NoURL)
        .then((url) => service.saveLink(url))
        .then((id) => res.send(id.value))
        .catch(handleError(res))
    )
    .get("/", (req, res) =>
      readQuery(req, "url", Errors.NoURL)
        .then((url) => service.getLinkID(url))
        .then((id) => res.send(id.value))
        .catch(handleError(res))
    );

export default link;
