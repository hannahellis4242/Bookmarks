import Config from "./Config";

const getEnvConfig = async (): Promise<Config> => {
  const hostname = process.env.HOST;
  if (!hostname) {
    return Promise.reject(new Error("No HOST in environment"));
  }
  const portStr = process.env.PORT;
  if (!portStr) {
    return Promise.reject(new Error("No PORT in environment"));
  }
  const port = parseInt(portStr);
  if (!Number.isInteger(port)) {
    return Promise.reject(new Error("PORT is not an integer"));
  }
  const databaseHost = process.env.DB_HOST
  if (!databaseHost) {
    return Promise.reject(new Error("No DB_HOST in environment"));
  }
  return { hostname, port,databaseHost };
};
export default getEnvConfig;