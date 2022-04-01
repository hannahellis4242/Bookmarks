import React, { useContext, useEffect, useState } from "react";
import { LinksContext } from "../store/LinksContext";
import classes from "./BookmarkTable.module.css";

const BookmarkCards: React.FC = () => {
  const { links, getAll } = useContext(LinksContext);
  useEffect(() => {
    getAll();
  }, []);

  return (
    <section>
      {links.map(({ url, tags }) => (
        <section>
          <header>{url}</header>
          <ul>
            {tags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
};

export default BookmarkCards;
