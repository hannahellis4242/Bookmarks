import { Router } from "express";

const welcome = Router();

welcome.get("/",(req,res)=>{
    res.send("TODO");
})

export default welcome;