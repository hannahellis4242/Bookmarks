import type { AppProps } from "next/app";
import BookmarksContextProvider from "../store/BookmarksContext";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <BookmarksContextProvider>
      <Component {...pageProps} />
    </BookmarksContextProvider>
  );
};

export default MyApp;
