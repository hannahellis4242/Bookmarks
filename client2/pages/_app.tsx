import type { AppProps } from "next/app";
import BookmarksContextProvider from "../store/BookmarksContext";
import LinksContextProvider from "../store/LinksContext";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <LinksContextProvider>
      <BookmarksContextProvider>
        <Component {...pageProps} />
      </BookmarksContextProvider>
    </LinksContextProvider>
  );
};

export default MyApp;
