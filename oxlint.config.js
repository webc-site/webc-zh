export default {
  env: {
    browser: true,
    svelte: true,
  },
  jsPlugins: ["eslint-plugin-svelte"],
  rules: {
    "svelte/no-at-html-tags": "error",
    "svelte/comment-directive": "error",
  },
};
