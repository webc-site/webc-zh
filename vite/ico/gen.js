#!/usr/bin/env node
import {
  IconTransformationType as TYPE,
  generateFaviconFiles as genFiles,
} from "@realfavicongenerator/generate-favicon";
import {
  getNodeImageAdapter as nodeAdapter,
  loadAndConvertToSvg as loadSvg,
} from "@realfavicongenerator/image-adapter-node";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import svgMinify from "~/vite/svgMinify.js";

const DIR = import.meta.dirname,
  DIST = join(DIR, "../../public"),
  SVG = join(DIST, "svg/site.svg"),
  BG = "#000000",
  bgTrans = (scale) => ({
    type: TYPE.Background,
    backgroundColor: BG,
    backgroundRadius: 0,
    imageScale: scale,
  }),
  start = async () => {
    const adapter = await nodeAdapter(),
      icon_src = { icon: await loadSvg(SVG) },
      fav_conf = {
        icon: {
          desktop: {
            regularIconTransformation: { type: TYPE.None },
            darkIconType: "none",
          },
          touch: {
            transformation: bgTrans(0.8),
            appTitle: "MySite",
          },
          webAppManifest: {
            transformation: bgTrans(0.7),
            backgroundColor: BG,
            themeColor: BG,
            name: "MyWebSite",
            shortName: "MySite",
          },
        },
        path: "/",
        skipMetadataInjection: false,
      },
      res_files = await genFiles(icon_src, fav_conf, adapter);

    await mkdir(DIST, { recursive: true });

    for (const [name, data] of Object.entries(res_files)) {
      const file_data = name.endsWith(".svg") ? svgMinify(data.toString()) : data;
      await writeFile(join(DIST, name), file_data);
    }
  };

export default start;
if (import.meta.main) await start();
