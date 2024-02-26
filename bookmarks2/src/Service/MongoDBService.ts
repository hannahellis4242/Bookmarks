import { MongoClient, ObjectId, WithId } from "mongodb";
import ServiceErrors from "./ServiceErrors";
import LinkService from "./LinkService";
import LinkID, { linkId } from "./LinkID";
import LabelID, { labelID } from "./LabelID";
import TagID, { tagID } from "./TagID";
import LabelService from "./LabelService";
import TagService from "./TagService";
import Link from "../Model/Link";

export interface CollectionNames {
  readonly link: string;
  readonly label: string;
  readonly tag: string;
}

export default class MongoDBService
  implements LinkService, LabelService, TagService
{
  private url: string;
  constructor(
    host: string,
    private readonly dbName: string,
    private readonly collections: CollectionNames
  ) {
    this.url = `mongodb://${host}:27017`;
  }
  findTagsWithLabel(labelId: LabelID): Promise<TagID[]> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.tag))
      .then((collection) => collection.find({ label: labelId.value }).toArray())
      .then((existing) =>
        existing.length === 0
          ? Promise.reject(ServiceErrors.NotFound)
          : Promise.resolve(existing.map(({ _id }) => tagID(_id.toString())))
      )
      .finally(() => client.close());
  }
  getTagLinkID(tagId: TagID): Promise<LinkID> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.tag))
      .then((collection) =>
        collection.findOne<Link>({ _id: new ObjectId(tagId.value) })
      )
      .then((existing) =>
        existing
          ? Promise.resolve(existing.link)
          : Promise.reject(ServiceErrors.NotFound)
      )
      .then((value) => linkId(value))
      .finally(() => client.close());
  }
  getLink(id: LinkID): Promise<Link> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.link))
      .then((collection) =>
        collection.findOne<Link>({ _id: new ObjectId(id.value) })
      )
      .then((existing) =>
        existing !== null
          ? Promise.resolve({link:existing.link})
          : Promise.reject(ServiceErrors.NotFound)
      )
      .finally(() => client.close());
  }
  saveLabel(label: string): Promise<LabelID> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.label))
      .then((collection) =>
        collection
          .findOne({ label })
          .then((existing) => ({ collection, existing }))
      )
      .then(({ collection, existing }) =>
        existing === null
          ? Promise.resolve(collection)
          : Promise.reject(ServiceErrors.AlreadyExists)
      )
      .then((collection) => collection.insertOne({ label }))
      .then((doc) => labelID(doc.insertedId.toString()))
      .catch((error) => {
        console.error(`Link Service Error : ${error}`);
        return error === ServiceErrors.AlreadyExists
          ? Promise.reject(ServiceErrors.AlreadyExists)
          : Promise.reject(ServiceErrors.DBError);
      })
      .finally(() => client.close());
  }
  getLabelID(label: string): Promise<LabelID> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.label))
      .then((collection) => collection.findOne({ label }))
      .then((found) =>
        found
          ? Promise.resolve(found._id)
          : Promise.reject(ServiceErrors.NotFound)
      )
      .then((id) => labelID(id.toString()))
      .finally(() => client.close());
  }
  removeLabel(id: LabelID): Promise<void> {
    //TODO
    throw new Error("Method not implemented.");
  }
  addTag(linkID: LinkID, labelID: LabelID): Promise<TagID> {
    const link = linkID.value;
    const label = labelID.value;
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.tag))
      .then((collection) =>
        collection
          .findOne({ link, label })
          .then((existing) => ({ collection, existing }))
      )
      .then(({ collection, existing }) =>
        existing === null
          ? Promise.resolve(collection)
          : Promise.reject(ServiceErrors.AlreadyExists)
      )
      .then((collection) => collection.insertOne({ link, label }))
      .then((doc) => tagID(doc.insertedId.toString()))
      .catch((error) => {
        console.error(`Link Service Error : ${error}`);
        return error === ServiceErrors.AlreadyExists
          ? Promise.reject(ServiceErrors.AlreadyExists)
          : Promise.reject(ServiceErrors.DBError);
      })
      .finally(() => client.close());
  }
  removeLink(id: LinkID): Promise<void> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.link))
      .then((collection) =>
        collection.deleteOne({ _id: new ObjectId(id.value) })
      )
      .then((result) =>
        result.acknowledged
          ? Promise.resolve(result.deletedCount)
          : Promise.reject(ServiceErrors.DBError)
      )
      .then((count) =>
        count > 0 ? Promise.resolve() : Promise.reject(ServiceErrors.NotFound)
      )
      .catch((error) => {
        console.error(error);
        return Promise.reject(ServiceErrors.DBError);
      })
      .finally(() => client.close());
  }
  getLinkID(link: Link): Promise<LinkID> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.link))
      .then((collection) => collection.findOne(link))
      .then((found) =>
        found
          ? Promise.resolve(found._id)
          : Promise.reject(ServiceErrors.NotFound)
      )
      .then((id) => linkId(id.toString()))
      .finally(() => client.close());
  }
  saveLink(link: Link): Promise<LinkID> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.link))
      .then((collection) =>
        collection.findOne(link).then((existing) => ({ collection, existing }))
      )
      .then(({ collection, existing }) =>
        existing === null
          ? Promise.resolve(collection)
          : Promise.reject(ServiceErrors.AlreadyExists)
      )
      .then((collection) => collection.insertOne(link))
      .then((doc) => linkId(doc.insertedId.toString()))
      .catch((error) => {
        console.error(`Link Service Error : ${error}`);
        return error === ServiceErrors.AlreadyExists
          ? Promise.reject(ServiceErrors.AlreadyExists)
          : Promise.reject(ServiceErrors.DBError);
      })
      .finally(() => client.close());
  }
  /*findUser(name: string): Promise<UserID> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collectionName))
      .then((collection) => collection.find({ name }).toArray())
      .catch((error) => {
        console.error(error);
        return Promise.reject(ServiceErrors.DBError);
      })
      .then((docs) =>
        docs.length === 0
          ? Promise.reject(ServiceErrors.NotFound)
          : Promise.resolve(docs),
      )
      .then((docs) =>
        docs.length === 1
          ? Promise.resolve(docs[0])
          : Promise.reject(ServiceErrors.TooMany),
      )
      .then(({ _id }) => userId(_id.toString()))
      .finally(() => client.close());
  }
  verifyUser(name: string, password: string): Promise<boolean> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collectionName))
      .then((collection) => collection.find({ name }).toArray())
      .catch((error) => {
        console.error(error);
        return Promise.reject(ServiceErrors.DBError);
      })
      .then((docs) =>
        docs.length === 0
          ? Promise.reject(ServiceErrors.NotFound)
          : Promise.resolve(docs),
      )
      .then((docs) =>
        docs.length === 1
          ? Promise.resolve(docs[0])
          : Promise.reject(ServiceErrors.TooMany),
      )
      .then(({ hashed }) => compare(password, hashed))
      .finally(() => client.close());
  }
  saveUser({ name, password }: User): Promise<UserID> {
    return hash(password, 12).then((hashed) => {
      const client = new MongoClient(this.url);
      return client
        .connect()
        .then((client) => client.db(this.dbName))
        .then((db) => db.collection(this.collectionName))
        .then((collection) => collection.insertOne({ name, hashed }))
        .then((doc) => userId(doc.insertedId.toString()))
        .catch((error) => {
          console.error(error);
          return Promise.reject(ServiceErrors.DBError);
        })
        .finally(() => client.close());
    });
  }
  removeUser(id: UserID): Promise<void> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collectionName))
      .then((collection) =>
        collection.deleteOne({ _id: new ObjectId(id.value) }),
      )
      .then((result) =>
        result.acknowledged
          ? Promise.resolve(result.deletedCount)
          : Promise.reject(ServiceErrors.DBError),
      )
      .then((count) =>
        count > 0 ? Promise.resolve() : Promise.reject(ServiceErrors.NotFound),
      )
      .catch((error) => {
        console.error(error);
        return Promise.reject(ServiceErrors.DBError);
      })
      .finally(() => client.close());
  }
  update(name: string, password: string): Promise<void> {
    return hash(password, 12).then((hashed) => {
      const client = new MongoClient(this.url);
      return client
        .connect()
        .then((client) => client.db(this.dbName))
        .then((db) => db.collection(this.collectionName))
        .then((collection) =>
          collection.updateOne({ name }, { $set: { hashed } }),
        )
        .then((result) =>
          result.acknowledged
            ? Promise.resolve(result.matchedCount)
            : Promise.reject(ServiceErrors.DBError),
        )
        .then((count) =>
          count > 0
            ? Promise.resolve()
            : Promise.reject(ServiceErrors.NotFound),
        )
        .catch((error) => {
          console.error(error);
          return Promise.reject(ServiceErrors.DBError);
        })
        .finally(() => client.close());
    });
  }*/
}
