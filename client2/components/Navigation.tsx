import React from "react";

const Navigation: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/bookmarks">Bookmarks</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
