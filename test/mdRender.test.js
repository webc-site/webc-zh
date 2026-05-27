// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import mdRender from "~/js/mdRender.js";

describe("mdRender alert blockquotes", () => {
  it("should parse [!TIP] blockquote and transform it", () => {
    const div = document.createElement("div"),
      markdown = "> [!TIP]\n> This is a tip";

    mdRender(div, markdown);

    const bq = div.querySelector("blockquote");
    expect(bq).not.toBeNull();
    expect(bq.classList.contains("alert")).toBe(true);
    expect(bq.classList.contains("alert-tip")).toBe(true);

    const title = bq.querySelector(".alert-title");
    expect(title).not.toBeNull();
    expect(title.textContent.trim() == "TIP").toBe(true);

    const icon = title.querySelector(".alert-icon");
    expect(icon).not.toBeNull();

    expect(bq.textContent.includes("This is a tip")).toBe(true);
    expect(bq.textContent.includes("[!TIP]")).toBe(false);
  });

  it("should parse other alert types", () => {
    const types = ["NOTE", "WARNING", "IMPORTANT", "CAUTION"];
    for (const type of types) {
      const div = document.createElement("div");
      mdRender(div, "> [!" + type + "]\n> Info");
      const bq = div.querySelector("blockquote");
      expect(bq.classList.contains("alert-" + type.toLowerCase())).toBe(true);
    }
  });

  it("should not modify normal blockquotes", () => {
    const div = document.createElement("div");
    mdRender(div, "> Normal blockquote");
    const bq = div.querySelector("blockquote");
    expect(bq).not.toBeNull();
    expect(bq.classList.contains("alert")).toBe(false);
  });
});
