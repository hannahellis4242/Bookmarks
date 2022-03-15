import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Bookmarks from "./routes/Bookmarks";
import Tags from "./routes/Tags";
import Users from "./routes/Users";

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="bookmarks" element={<Bookmarks />} />
      <Route path="tags" element={<Tags />} />
      <Route path="users" element={<Users />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
