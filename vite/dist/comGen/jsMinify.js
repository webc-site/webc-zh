import { minifySync } from "@swc/core";

export default (code) => minifySync(code, { compress: true, mangle: true, module: true }).code;
