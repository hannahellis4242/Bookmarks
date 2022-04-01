import React, { useContext } from "react";
import { UserContext } from "../store/UserContext";
const User: React.FC = () => {
  const user = useContext(UserContext);
  return (
    <section>
      <p>user info section</p>
      <p>current user {user.user}</p>
    </section>
  );
};

export default User;
