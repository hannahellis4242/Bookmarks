import Result from "./Result";
import mysql from "mysql2";
const queryDB = (queryStr: string): Result<any, Error> => {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "test",
    database: "bookmarks",
  });
  try {
    connection.connect((error) => {
      if (error) {
        return Result.Err<any, Error>(error);
      } else {
        connection.query(queryStr, (err, results, _) => {
          if (err) {
            return Result.Err<any, Error>(err);
          } else {
            connection.end();
            return Result.Ok<any, Error>(results);
          }
        });
        connection.end();
      }
    });
  } catch (error) {
    return Result.Err<any, Error>(new Error(JSON.stringify(error)));
  }
  return Result.Err<any, Error>(new Error("How did we get here???"));
};

export default queryDB;
