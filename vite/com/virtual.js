export default (cap_name, html_content, entry_file, html_file, entry_content) => ({
  name: "virtual-com-entry",
  configureServer: (server) => {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url.split("?")[0];
      if (url === "/" + cap_name + ".html" || url === "/") {
        const html = await server.transformIndexHtml(req.url, html_content);
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(html);
        return;
      }
      next();
    });
  },
  resolveId: (id) => {
    if (id === "/" + cap_name + ".entry.js" || id === entry_file) {
      return entry_file;
    }
    if (id === html_file) {
      return html_file;
    }
  },
  load: (id) => {
    if (id === entry_file) {
      return entry_content;
    }
    if (id === html_file) {
      return html_content;
    }
  },
});
