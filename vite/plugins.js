import pugPlugin from "~/vite/pug.js";
import styleMinify from "~/vite/styleMinify.js";
import jsMinify from "~/vite/jsMinify.js";
import icoGen from "~/vite/icoGen.js";
import ROOT from "~/vite/const/ROOT.js";
import pluginComm from "~/vite/plugin/comSvg.js";
import spaHistoryFallback from "~/vite/spaHistoryFallback.js";
import watchReadme from "~/vite/watchReadme.js";

export default (is_build) => {
  const comm = [...pluginComm(ROOT, is_build, true), icoGen(), pugPlugin(is_build)];
  return is_build
    ? [...comm, styleMinify(), jsMinify()]
    : [spaHistoryFallback(), ...comm, watchReadme()];
};
