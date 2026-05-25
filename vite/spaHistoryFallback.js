export default () => ({
  name: "spa-history-fallback",
  configureServer: (server) => {
    server.middlewares.use((req, res, next) => {
      const [url, query] = req.url.split("?");
      if (
        req.method == "GET" &&
        url != "/" &&
        !url.includes(".") &&
        req.headers.accept?.includes("text/html")
      ) {
        req.url = "/index.html" + (query ? "?" + query : "");
      }
      next();
    });
  },
});
