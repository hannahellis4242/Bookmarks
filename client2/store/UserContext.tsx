import { createContext, useState } from "react";
import axios from "axios";

interface UserContext {
  user: string | null;
  login: (name: string) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContext>({
  user: null,
  login: (_: string) => {},
  logout: () => {},
});

const UserContextProvider: React.FC = (props) => {
  const [user, setUser] = useState<string | null>(null);

  const loginHandler = (name: string) => {
    setUser(() => name);
  };

  const logoutHandler = () => {
    setUser(() => null);
  };

  const context = {
    user: user,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <UserContext.Provider value={context}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
