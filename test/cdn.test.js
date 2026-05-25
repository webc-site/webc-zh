import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import read from "@3-/read";
import main from "~/sh/dist/cdn.js";
import ROOT from "~/vite/const/ROOT.js";
import CDN_PKG from "~/conf/npm/CDN_PKG.js";

describe("sh/dist/cdn.js build", () => {
  it("should generate dist/@webc/cdn/Btn.css with peer imports", async () => {
    await main();
    const btnCssPath = join(ROOT, "dist", CDN_PKG, "Btn.css");
    expect(existsSync(btnCssPath)).toBe(true);
    const content = read(btnCssPath);
    expect(content).toContain('@import "./Lg.css";');
  }, 40000);
});
