import { createContext, useState } from "react";
import Bookmark from "../models/bookmark";

interface BookmarksModelContext {
  bookmarks: Bookmark[];
  getAll: () => void;
}

export const BookmarksContext = createContext<BookmarksModelContext>({
  bookmarks: [],
  getAll: () => {},
});

const BookmarksContextProvider: React.FC = (props) => {
  const [result, setResult] = useState<Bookmark[]>([]);

  const getAllHandler = () => {
    //looks like we need our own node.js sever to handle this
    /*const connection = mysql.createConnection({
      host: "localhost",
      user: "admin",
      password: "password",
      database: "bookmarks",
    });
    connection.connect((error) => {
      if (error) {
        console.error("error connecting to database: " + error.stack);
        return;
      }
      connection.end();
    });*/
  };

  const context = {
    bookmarks: result,
    getAll: getAllHandler,
  };
  return (
    <BookmarksContext.Provider value={context}>
      {props.children}
    </BookmarksContext.Provider>
  );
};

export default BookmarksContextProvider;
