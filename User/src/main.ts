import express from "express";
import getEnvConfig from "./Config/getEnvConfig";
import { exit } from "process";

const config = getEnvConfig()||readConfigFile();
if(!config){
    console.error("No valid configuration found!");
    exit(1);
}
const app = express();


app.listen(config.port,config.hostname,()=>console.log(`listening on ${config.hostname}:${config.port}`))