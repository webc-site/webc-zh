import { defineConfig } from "vite";
import buildCom from "~/com.js";
import ENTRIES from "~/vite/const/ENTRIES.js";
import plugins from "~/vite/plugins.js";
import init from "~/sh/init.js";
import ROOT from "~/vite/const/ROOT.js";

if (!process.argv.some((v) => v.includes("node_modules/knip/"))) {
  await init();
  await buildCom();
}

export default defineConfig(async (cfg) => {
  const { command } = cfg,
    is_build = command == "build";

  return {
    base: "/",
    resolve: {
      alias: {
        "~/": ROOT,
      },
    },
    server: {
      port: 5180,
    },
    plugins: plugins(is_build),
    build: {
      minify: false,
      cssMinify: "lightningcss",
      rollupOptions: {
        input: Object.keys(ENTRIES),
      },
    },
    test: {
      exclude: ["**/node_modules/**", "**/dist/**", "srv/workerd/**"],
    },
  };
});
