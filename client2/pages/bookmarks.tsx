import type { NextPage } from "next";
import { useContext, useEffect } from "react";
import BookmarkCards from "../components/BookmarkCards";
import Navigation from "../components/Navigation";
import User from "../components/User";
import { BookmarksContext } from "../store/BookmarksContext";

const Bookmarks: NextPage = () => {
  const bookmarksModel = useContext(BookmarksContext);
  useEffect(() => bookmarksModel.getAll(), []);
  return (
    <main>
      <Navigation />
      <User />
      <BookmarkCards />
    </main>
  );
};

export default Bookmarks;
