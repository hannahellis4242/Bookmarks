import type { NextPage } from "next";
import Navigation from "../components/Navigation";
import User from "../components/User";

const Home: NextPage = () => {
  return (
    <main>
      <Navigation />
      <User />
      <header>Home</header>
    </main>
  );
};

export default Home;
