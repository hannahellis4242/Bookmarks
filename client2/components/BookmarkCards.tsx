import { linkSync } from "fs";
import React, { useContext, useEffect, useState } from "react";
import { LinksContext } from "../store/LinksContext";
import classes from "./BookmarkTable.module.css";

interface CardData {
  link: string;
  tags: string[];
}

type Cards = CardData[];

const BookmarkCards: React.FC = () => {
  const links = useContext(LinksContext);
  const [cards, setCards] = useState<Cards>([]);
  useEffect(() => {
    links.getAll();
    links.links.map((link) => {
      //for this link we need to get all the tags that go wtih this link
    });
  }, []);

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

export default BookmarkCards;
