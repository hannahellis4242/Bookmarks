import React, { useContext, useEffect, useState } from "react";
import { LinksContext } from "../store/LinksContext";
import classes from "./BookmarkCard.module.css";

const BookmarkCards: React.FC = () => {
  const { links, getAll } = useContext(LinksContext);
  useEffect(() => {
    getAll();
  }, []);

  return (
    <section className={classes.cards}>
      {links.map(({ url, tags }) => (
        <section>
          <header>
            <a href={url} target="_blank">
              {url}
            </a>
          </header>
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
