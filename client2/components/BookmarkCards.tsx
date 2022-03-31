import axios from "axios";
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
      console.log("getting tags for ", link);
      axios
        .get(`http://localhost:5000/tags?link=${link}`)
        .then(({ data }) => console.log(data))
        .catch((reason) => console.log("error : ", reason));
    });
  }, []);

  return (
    <section>
      {cards.map(({ link, tags }) => (
        <section>
          <header>{link}</header>
          <ul>
            {tags.map((tag, index) => (
              <li key={index}>tag</li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
};

export default BookmarkCards;
