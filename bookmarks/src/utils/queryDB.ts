import Result from "./Result";
import mysql from "mysql2";

const queryDB = async (queryStr: string) => {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "test",
    database: "bookmarks",
  });

  return new Promise((resolve, reject) => {
    try {
      connection.connect((error) => {
        if (error) {
          reject(error);
        } else {
          connection.query(queryStr, (err, results, _) => {
            if (err) {
              reject(err);
            } else {
              connection.end();
              resolve(results);
            }
          });
          connection.end();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default queryDB;
