#!/usr/bin/env bun
import R from "../lib/R.js";

const key = "worker:127.0.0.1/test",
  val = JSON.stringify({
    compatibilityDate: "2026-05-26",
    code: "export default {\n  async fetch(req) {\n    return new Response('Hello from dynamic worker seeded by Bun!');\n  }\n};",
  });

console.log("Seeding Redis key: " + key);
await R.set(key, val);

console.log("Seed success. Reading back:");
const res = await R.get(key);
console.log(res);

await R.quit();
process.exit(0);
