import { resolve } from "node:path";
import ROOT from "~/vite/const/ROOT.js";
import genReadme from "~/vite/gen/doc/readme.js";

export default () => ({
  name: "watch-readme",
  configureServer: (server) => {
    const readme = resolve(ROOT, "README.md");
    server.watcher.add(readme);
    server.watcher.on("change", (file) => {
      if (file === readme) {
        genReadme(readme);
        server.hot.send({ type: "full-reload" });
      }
    });
  },
});
