import save from "~/vite/gen/doc/save.js";

const genIndex = (meta) => {
  const js = [
    "[",
    meta
      .map(
        ([name, title, import_str]) =>
          "  [" + JSON.stringify(name) + ", " + JSON.stringify(title) + ", " + import_str + "]",
      )
      .join(",\n"),
    "]",
  ].join("\n");
  save("index.js", js);
};

export default genIndex;
