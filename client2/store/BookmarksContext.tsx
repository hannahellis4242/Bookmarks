import { createContext, useState } from "react";
import Bookmark from "../models/bookmark";
import axios from "axios";

interface BookmarksModelContext {
  bookmarks: Bookmark[];
  getAll: () => void;
}

export const BookmarksContext = createContext<BookmarksModelContext>({
  bookmarks: [],
  getAll: () => {},
});

const BookmarksContextProvider: React.FC = (props) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const getAllHandler = () => {
    axios
      .get("http://localhost:5000/bookmarks")
      .then(({ data }) => setBookmarks(() => data))
      .catch((reason) => console.log("error : ", reason));
  };

  const context = {
    bookmarks: bookmarks,
    getAll: getAllHandler,
  };
  return (
    <BookmarksContext.Provider value={context}>
      {props.children}
    </BookmarksContext.Provider>
  );
};

export default BookmarksContextProvider;
