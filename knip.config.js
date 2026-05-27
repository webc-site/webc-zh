import srv from "~/srv/knip.config.js";

export default {
  workspaces: {
    ".": {
      entry: [
        "ai/lib/gci.js",
        "ai/*.js",
        "ai/test/**/*.js",
        "com.js",
        "com/*/*.js",
        "page/entry/*.{js,svelte}",
        "sh/demo.js",
        "sh/dist/*.js",
        "sh/env.js",
        "sh/init.js",
        "sh/hook/*.js",
        "vite/com/dev.js",
        "vite/dist/*.js",
        "vite/pug/*.js",
        ".agents/skills/*.js",
        "gitPage.js",
        "sh/*.js",
      ],
      project: ["**/*.{js,svelte}"],
      paths: {
        "x/*": ["./x/*"],
        "~/*": ["./*"],
      },
      ignore: ["cli/**", "x/**", "com/*/demo/**", "oxlint.config.js", "sh/example/**"],
      ignoreBinaries: ["sh/hook/*"],
      ignoreDependencies: ["oxfmt", "oxlint"],
    },
    srv,
  },
};
