import { Collection, Document, MongoClient, ObjectId } from "mongodb";
import UserService from "./Service";
import UserID, { userId } from "./UserID";
import ServiceErrors from "./ServiceErrors";
import LinkService from "./LinkService";
import LinkID, { linkId } from "./LinkID";

export default class MongoDBService implements UserService, LinkService {
  private url: string;
  constructor(
    host: string,
    private readonly dbName: string,
    private readonly linkCollectionName: string
  ) {
    this.url = `mongodb://${host}:27017`;
  }
  removeLink(id: LinkID): Promise<void> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.linkCollectionName))
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
  getLinkID(url: string): Promise<LinkID> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.linkCollectionName))
      .then((collection) => collection.findOne({ url }))
      .then((found) =>
        found ? Promise.resolve(found._id) : Promise.reject(ServiceErrors.NotFound)
      )
      .then((id)=>linkId(id.toString()))
      .finally(() => client.close());
  }
  saveLink(url: string): Promise<LinkID> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.linkCollectionName))
      .then((collection) =>
        collection
          .findOne({ url })
          .then((existing) => ({ collection, existing }))
      )
      .then(({ collection, existing }) =>
        existing === null
          ? Promise.resolve(collection)
          : Promise.reject(ServiceErrors.AlreadyExists)
      )
      .then((collection) => collection.insertOne({ url }))
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
