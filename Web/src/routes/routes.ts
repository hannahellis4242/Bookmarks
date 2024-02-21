import { Router } from "express";
import login from "./login";

const routes = Router();

routes.get("/",(req,res)=>{
    const {user}=req.session;
    if(!user){
        res.redirect("/login");
        return;
    }
    res.redirect("/welcome");
})
routes.use("/login",login);
routes.use("/welcome",welcome);

export default routes;