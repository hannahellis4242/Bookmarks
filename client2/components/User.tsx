import React, { useContext } from "react";
import { UserContext } from "../store/UserContext";
const User: React.FC = () => {
  const user = useContext(UserContext);
  if (user.user) {
    return (
      <section>
        <p>Welcome {user.user}</p>
        <button>logout</button>
      </section>
    );
  }
  return (
    <section>
      <p>Please Login to add new bookmarks or tags</p>
      <button>login</button>
    </section>
  );
};

export default User;
