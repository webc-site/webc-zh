import pugPlugin from "~/vite/pug.js";
import styleMinify from "~/vite/styleMinify.js";
import jsMinify from "~/vite/jsMinify.js";
import icoGen from "~/vite/icoGen.js";
import ROOT from "~/vite/const/ROOT.js";
import pluginComm from "~/vite/pluginComm.js";

export default (is_build) => {
  const plugins = [...pluginComm(ROOT, is_build, true), icoGen(), pugPlugin(is_build)];

  if (is_build) {
    plugins.push(styleMinify(), jsMinify());
  }

  return plugins;
};
