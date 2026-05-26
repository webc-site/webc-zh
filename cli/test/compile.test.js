import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, rmSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import read from "@3-/read";

describe("cli compile confirm", () => {
  let LIB, PUBLIC, compile;

  beforeAll(async () => {
    const tmp = join(import.meta.dirname, "../tmp");
    mkdirSync(tmp, { recursive: true });
    writeFileSync(join(tmp, "package.json"), JSON.stringify({ type: "module" }));
    process.chdir(tmp);

    const dir = await import("../src/const/DIR.js");
    LIB = dir.LIB;
    PUBLIC = dir.PUBLIC;

    const compileModule = await import("../src/compile/index.js");
    compile = compileModule.default;

    rmSync(LIB, { recursive: true, force: true });
    rmSync(join(PUBLIC, "com"), { recursive: true, force: true });
  });

  it("should compile confirm and process svg/css correctly", async () => {
    const { default: resolveMetadata } = await import("../src/resolve.js"),
      metadata = await resolveMetadata();
    expect(metadata).toBeDefined();
    const [version] = metadata,
      { cache } = await import("../src/download.js"),
      dir = cache(version);

    // Run compile
    compile(dir, "Confirm");

    // Verify lib files
    expect(existsSync(join(LIB, "Confirm.js"))).toBe(true);
    expect(existsSync(join(LIB, "Confirm", "var.css"))).toBe(true);

    // Verify public svg assets
    expect(existsSync(join(PUBLIC, "com", "Confirm", "svg", "ok.svg"))).toBe(true);
    expect(existsSync(join(PUBLIC, "com", "Confirm", "svg", "x.svg"))).toBe(true);

    // Verify CSS url rewrite
    const varCss = read(join(LIB, "Confirm", "var.css"));
    expect(varCss).toContain('url("/com/Confirm/svg/ok.' + 'svg")');
    expect(varCss).toContain('url("/com/Confirm/svg/x.' + 'svg")');
  });
});
