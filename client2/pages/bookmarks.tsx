import type { NextPage } from "next";
import { useContext, useEffect } from "react";
import BookmarkTable from "../components/BookmarkTable";
import Navigation from "../components/Navigation";
import { BookmarksContext } from "../store/BookmarksContext";

const Bookmarks: NextPage = () => {
  const bookmarksModel = useContext(BookmarksContext);
  useEffect(() => bookmarksModel.getAll(), []);
  return (
    <main>
      <Navigation />
      <header>Bookmarks</header>
      <BookmarkTable />
    </main>
  );
};

export default Bookmarks;
