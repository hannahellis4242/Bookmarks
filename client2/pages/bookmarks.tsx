import type { NextPage } from "next";
import { useContext } from "react";
import Navigation from "../components/Navigation";
import { BookmarksContext } from "../store/BookmarksContext";

const Bookmarks: NextPage = () => {
  const bookmarksContext = useContext(BookmarksContext);
  bookmarksContext.getAll();
  return (
    <main>
      <Navigation />
      <header>Bookmarks</header>
    </main>
  );
};

export default Bookmarks;
