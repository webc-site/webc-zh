import { minifySync } from "@swc/core";

export default () => ({
  name: "swc-minify",
  renderChunk: (code, chunk) => {
    if (chunk.fileName.endsWith(".js")) {
      const { code: minified, map } = minifySync(code, {
        compress: true,
        mangle: true,
        sourceMap: true,
        module: true,
      });
      return {
        code: minified,
        map: map ? JSON.parse(map) : null,
      };
    }
    return null;
  },
});
