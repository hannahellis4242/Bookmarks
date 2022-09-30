import { Express } from "express";
import Configuration from "./Configuration";
import { createHTTPSServer, runHTTPSServer } from "./createHTTPSSever";
import { runRedirectServer } from "./createRedirectServer";

export const runWithRedirect = async (app: Express, config: Configuration) => {
  runRedirectServer(config.ports.open, config.ports.secure);
  runHTTPSServer(app, config.options, config.ports.secure);
};
