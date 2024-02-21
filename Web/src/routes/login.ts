import { Router } from "express";

const login = Router();
login.get("/", (_, res) => res.render("login"));
/*login.post("/", (req, res) => {
  //res.redirect("/pages");
});*/

export default login;