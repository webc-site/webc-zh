import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import read from "@3-/read";
import main from "~/com.js";
import ROOT from "~/vite/const/ROOT.js";

describe("com.js build", () => {
  it("should compile and generate lib/Btn.js with peer imports", async () => {
    await main();
    const btnJsPath = join(ROOT, "lib", "Btn.js");
    expect(existsSync(btnJsPath)).toBe(true);
    const content = read(btnJsPath);
    expect(content).toContain("import './Lg/Lg.css'");
    expect(content).toContain("import './Lg/var.css'");
  }, 30000);
});
