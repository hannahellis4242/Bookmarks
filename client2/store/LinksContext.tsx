import { createContext, useState } from "react";
import Link from "../models/Link";
import axios from "axios";

interface LinksModelContext {
  links: Link[];
  getAll: () => void;
}

export const LinksContext = createContext<LinksModelContext>({
  links: [],
  getAll: () => {},
});

const LinksContextProvider: React.FC = (props) => {
  const [links, setLinks] = useState<Link[]>([]);

  const getAllHandler = () => {
    setLinks(() => []);
    axios
      .get("http://localhost:5000/links/all")
      .then(({ data }) => {
        data.map(({ url }) => {
          axios
            .get(`http://localhost:5000/tags?link=${url}`)
            .then(({ data }) => {
              const link = new Link(
                url,
                data.map(({ tag }) => tag)
              );
              setLinks((prev) => prev.concat([link]));
            });
        });
      })
      .catch((reason) => console.log("error : ", reason));
  };

  const context = {
    links: links,
    getAll: getAllHandler,
  };
  return (
    <LinksContext.Provider value={context}>
      {props.children}
    </LinksContext.Provider>
  );
};

export default LinksContextProvider;
