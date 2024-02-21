import { MongoClient, ObjectId } from "mongodb";
import User from "../Model/User";
import Service from "./Service";
import UserID, { userId } from "./UserID";
import ServiceErrors from "./ServiceErrors";
import { compare, hash } from "bcrypt";

export default class MongoDBService implements Service {
  private url: string;
  constructor(
    host: string,
    private readonly dbName: string,
    private readonly collectionName: string,
  ) {
    this.url = `mongodb://${host}:27017`;
  }
  findUser(name: string): Promise<UserID> {
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
  }
}
