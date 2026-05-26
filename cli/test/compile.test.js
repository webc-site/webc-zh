import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, rmSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import read from "@3-/read";
import { execSync } from "node:child_process";

describe("cli compile and package merge", () => {
  let LIB, PUBLIC, compile, dir;

  const exist = (base, list) =>
    list.forEach((p) => expect(existsSync(join(base, ...(Array.isArray(p) ? p : [p])))).toBe(true));

  beforeAll(async () => {
    const tmp = join(import.meta.dirname, "../tmp");
    mkdirSync(tmp, { recursive: true });
    writeFileSync(join(tmp, "package.json"), JSON.stringify({ type: "module" }));
    process.chdir(tmp);

    const dirModule = await import("../src/const/DIR.js");
    LIB = dirModule.LIB;
    PUBLIC = dirModule.PUBLIC;

    const compileModule = await import("../src/compile/index.js");
    compile = compileModule.default;

    const { default: resolveMetadata } = await import("../src/resolve.js"),
      metadata = await resolveMetadata(),
      [version] = metadata,
      { cache } = await import("../src/download.js");
    dir = cache(version);

    rmSync(LIB, { recursive: true, force: true });
    rmSync(join(PUBLIC, "com"), { recursive: true, force: true });
  });

  it("should compile confirm and process svg/css correctly", async () => {
    compile(dir, "Confirm");

    exist(LIB, ["Confirm.js", ["Confirm", "var.css"]]);
    exist(join(PUBLIC, "com"), [
      ["Confirm", "svg", "ok.svg"],
      ["Confirm", "svg", "x.svg"],
    ]);

    const varCss = read(join(LIB, "Confirm", "var.css"));
    ["ok", "x"].forEach((name) =>
      expect(varCss).toContain('url("/com/Confirm/svg/' + name + '.svg")'),
    );
  });

  it("should compile I18n and copy all files including svg and package.json", async () => {
    compile(dir, "I18n");

    exist(LIB, [
      "I18n.js",
      ["I18n", "var.css"],
      ["I18n", "package.json"],
      ["I18n", "svg", "i18n.svg"],
    ]);
  });

  it("should merge I18n dependencies into root package.json when running CLI", async () => {
    const tmp = join(import.meta.dirname, "../tmp");
    writeFileSync(join(tmp, "package.json"), JSON.stringify({ type: "module" }));

    execSync("node ../src/cli.js i18n", { cwd: tmp });

    const pkg = JSON.parse(read(join(tmp, "package.json")));
    expect(pkg.dependencies).toBeDefined();
    expect(pkg.dependencies["@3-/lang"]).toBeDefined();
  });
});
