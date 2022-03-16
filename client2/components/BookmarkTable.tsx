import React, { useContext, useEffect } from "react";
import { BookmarksContext } from "../store/BookmarksContext";
import classes from "./BookmarkTable.module.css";

const BookmarkTable: React.FC = () => {
  const bookmarksModel = useContext(BookmarksContext);
  useEffect(() => bookmarksModel.getAll(), []);
  return (
    <table className={classes.blueTable}>
      <thead>
        <tr>
          <th>Link</th>
          <th>Tag</th>
          <th>User</th>
        </tr>
      </thead>
      <tbody>
        {bookmarksModel.bookmarks.map((bookmark) => (
          <tr key={bookmark.id}>
            <td>
              <a href={bookmark.link}>{bookmark.link}</a>
            </td>
            <td>{bookmark.tag}</td>
            <td>{bookmark.user}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookmarkTable;
