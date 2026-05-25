import { transform as lightningTransform } from "lightningcss";
import css2nest from "@3-/css2nest";

export default (is_build) => ({
  name: "css2nest",
  enforce: "post",
  generateBundle: (_, bundle) => {
    for (const i of Object.values(bundle)) {
      if (i.type == "asset" && i.fileName.endsWith(".css")) {
        let css = css2nest(i.source);
        if (is_build) {
          css = lightningTransform({
            filename: i.fileName,
            code: Buffer.from(css),
            minify: true,
          }).code.toString();
        }
        i.source = css;
      }
    }
  },
});
