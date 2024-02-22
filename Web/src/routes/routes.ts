import { Router } from "express";
import login from "./login";
import welcome from "./welcome";
import front from "./front";

const routes = Router();

routes.get("/",(req,res)=>{
    const {user}=req.session;
    if(!user){
        res.redirect("/front");
        return;
    }
    res.redirect("/welcome");
})
routes.use("/front",front);
routes.use("/login",login);
routes.use("/welcome",welcome);

export default routes;