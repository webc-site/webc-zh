import { join } from "node:path";
import { compileFile } from "pug";
import minifyHtml from "@minify-html/node";
import pug_conf from "~/conf/pug.js";
import ROOT from "~/vite/const/ROOT.js";
import ENTRIES from "~/vite/const/ENTRIES.js";

const { minify } = minifyHtml,
  TEMPLATE_PATH = join(ROOT, "pug/index.pug"),
  TEMPLATE = compileFile(TEMPLATE_PATH),
  render = (path) =>
    TEMPLATE({
      ...pug_conf,
      entry: path.slice(0, -3),
    });

export default (is_build) => {
  return {
    name: "vite-plugin-pug-entry",
    resolveId: (id) => (ENTRIES[id.replace(ROOT + "/", "")] ? id : null),
    load: (id) => {
      const entry_js = ENTRIES[id.replace(ROOT + "/", "")];
      return entry_js ? render(entry_js) : null;
    },
    configureServer: (server) => {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url.split("?")[0],
          name = url == "/" ? "index.html" : url.slice(1),
          entry_js = ENTRIES[name];
        if (entry_js) {
          try {
            const html = await server.transformIndexHtml(req.url, render(entry_js));
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (err) {
            next(err);
          }
          return;
        }
        next();
      });
    },
    transformIndexHtml: {
      order: "post",
      handler: (html) => {
        if (is_build) {
          return minify(Buffer.from(html), {
            minify_css: true,
            minify_js: true,
            keep_spaces_between_attributes: true,
          }).toString();
        }
        return html;
      },
    },
  };
};
