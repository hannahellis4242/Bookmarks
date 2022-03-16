import Link from "next/link";
import React from "react";

const Navigation: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/bookmarks">Bookmarks</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
