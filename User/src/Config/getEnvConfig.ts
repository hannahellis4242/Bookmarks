import Config from "./Config";

const getEnvConfig = (): Config | undefined => {
  const hostname = process.env.HOST;
  if (!hostname) {
    return undefined;
  }
  const portStr = process.env.PORT;
  if (!portStr) {
    return undefined;
  }
  const port = parseInt(portStr);
  if (!Number.isInteger(port)) {
    return undefined;
  }
  return { hostname, port };
};
export default getEnvConfig;