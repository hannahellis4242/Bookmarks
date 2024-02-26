import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import ServiceErrors from "../Service/ServiceErrors";
import LinkService from "../Service/LinkService";
import readQuery from "./utils/readQuery";
import LabelService from "../Service/LabelService";
import TagService from "../Service/TagService";
import handleError, { Errors } from "./utils/handleErrors";

const link = (service: LabelService & LinkService & TagService) =>
  Router()
    .post("/", (req, res) =>
      readQuery(req, "link", Errors.NoLink)
        .then((link) =>
          service
            .saveLink({ link })
            .catch((e) =>
              e === ServiceErrors.AlreadyExists
                ? service.getLinkID({ link })
                : Promise.reject(e)
            )
        )
        .then((urlID) =>
          readQuery(req, "label", Errors.NoLabel)
            .then((tag) =>
              service
                .saveLabel(tag)
                .catch((e) =>
                  e === ServiceErrors.AlreadyExists
                    ? service.getLabelID(tag)
                    : Promise.reject(e)
                )
            )
            .then((tagID) => ({ urlID, tagID }))
        )
        .then(({ urlID, tagID }) => service.addTag(urlID, tagID))
        .then((id) => res.status(StatusCodes.CREATED).send(id.value))
        .catch(handleError(res))
    )
    .get("/:label", (req, res) => {
      const { label } = req.params;
      return service
        .getLabelID(label)
        .then((labelID) => service.findTagsWithLabel(labelID))
        .then((tagIDs) =>
          Promise.all(tagIDs.map((tagId) => service.getTagLinkID(tagId)))
        )
        .then((linkIds) =>
          Promise.all(linkIds.map((link) => service.getLink(link)))
        )
        .then((links) => links.map(({ link }) => link))
        .then((links) => res.json(links))
        .catch(handleError(res));
    })
    .get("/", (req, res) =>
      readQuery(req, "link", Errors.NoLink)
      .then((x)=>{console.log(`here 1 : ${JSON.stringify(x,null,2)}`); return Promise.resolve(x)})
        .then((link) => service.getLinkID({ link }))
        .then((x)=>{console.log(`here 2 : ${JSON.stringify(x,null,2)}`); return Promise.resolve(x)})
        .then((linkId) => service.findTagsWithLink(linkId))
        .then((x)=>{console.log(`here 3 : ${JSON.stringify(x,null,2)}`); return Promise.resolve(x)})
        .then((tagIDs) =>
          Promise.all(tagIDs.map((tagId) => service.getTagLabelID(tagId)))
        )
        .then((x)=>{console.log(`here 4 : ${JSON.stringify(x,null,2)}`); return Promise.resolve(x)})
        .then((labelIds) =>
          Promise.all(labelIds.map((labelId) => service.getLabel(labelId)))
        )
        .then((x)=>{console.log(`here 5 : ${JSON.stringify(x,null,2)}`); return Promise.resolve(x)})
        .then((labels) => labels.map(({ label }) => label))
        .then((x)=>{console.log(`here 6 : ${JSON.stringify(x,null,2)}`); return Promise.resolve(x)})
        .then((labels) => res.json(labels))
        .catch(handleError(res))
    );
export default link;
