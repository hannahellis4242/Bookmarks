import { Router } from "express";

const front = Router();
front.get("/",(_,res)=>res.render("front"))
export default front;