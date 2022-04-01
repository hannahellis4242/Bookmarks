import type { AppProps } from "next/app";
import BookmarksContextProvider from "../store/BookmarksContext";
import LinksContextProvider from "../store/LinksContext";
import UserContextProvider from "../store/UserContext";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <UserContextProvider>
      <LinksContextProvider>
        <BookmarksContextProvider>
          <Component {...pageProps} />
        </BookmarksContextProvider>
      </LinksContextProvider>
    </UserContextProvider>
  );
};

export default MyApp;
