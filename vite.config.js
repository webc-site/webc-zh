import { defineConfig } from "vite";
import buildCom from "~/com.js";
import ENTRIES from "~/vite/const/ENTRIES.js";
import plugins from "~/vite/plugins.js";
import init from "~/sh/init.js";

await init();

const ROOT = import.meta.dirname;

export default defineConfig(async (cfg) => {
  const { command } = cfg,
    is_build = command == "build";

  await buildCom();

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
  };
});
