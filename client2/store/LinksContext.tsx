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
    axios
      .get("http://localhost:5000/links/all")
      .then(({ data }) => setLinks(() => data))
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
