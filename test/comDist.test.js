import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import main from "~/sh/dist/com.js";
import ROOT from "~/vite/const/ROOT.js";
import COM_PKG from "~/conf/npm/COM_PKG.js";

describe("sh/dist/com.js build", () => {
  it("should generate dist/@webc/com/Btn.js with peer imports", async () => {
    await main();
    const btnJsPath = join(ROOT, "dist", COM_PKG, "Btn.js");
    expect(existsSync(btnJsPath)).toBe(true);
    const content = readFileSync(btnJsPath, "utf-8");
    expect(content).toContain("import './Lg/Lg.css'");
    expect(content).toContain("import './Lg/var.css'");
  }, 30000);
});
