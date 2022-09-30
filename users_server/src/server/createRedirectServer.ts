import express from "express";

export const createRedirectServer = async (redirectPort: number) => {
  const server = express();
  server.all("*", (req, res) => {
    res.redirect("https://" + req.hostname + ":" + redirectPort + req.url);
  });
  return server;
};

export const runRedirectServer = async (
  port: number,
  redirectPort: number,
  callback?: () => void
) => {
  const http = await createRedirectServer(redirectPort);
  const server = await http.listen(port, callback);
  const safeClose = async () => {
    console.log("Closing http server.");
    server.close(() => console.log("HTTP server closed."));
  };
  process.on("SIGTERM", () => {
    console.info("SIGTERM signal received.");
    safeClose();
  });
  process.on("SIGINT", () => {
    console.info("SIGINT signal received.");
    safeClose();
  });
  process.on("SIGQUIT", () => {
    console.info("SIGQUIT signal received.");
    safeClose();
  });
  return server;
};
