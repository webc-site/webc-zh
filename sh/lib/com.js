import { join, resolve } from "node:path";
import ROOT from "~/vite/const/ROOT.js";

export default (input) => {
  const lower = input.toLowerCase();
  return resolve(
    ROOT,
    lower.startsWith("com/")
      ? "com/" + input.slice(4)
      : lower.startsWith("./com/")
        ? "com/" + input.slice(6)
        : join("com", input),
  );
};
