import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const prohibited = [/CodeReliability/i, /child_process/, /\beval\s*\(/, /unsafe-eval/, /git clone/i];
const scan = async (dir) => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", "dist", ".sites-runtime"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await scan(full);
    else if (/\.(ts|tsx|js|mjs|json|md|ya?ml)$/.test(entry.name)) {
      const text = await readFile(full, "utf8");
      for (const pattern of prohibited) {
        if (pattern.test(text) && !full.endsWith("scripts/verify-boundaries.mjs") && !full.endsWith("README.md")) throw new Error(`${pattern} found in ${full}`);
      }
    }
  }
};
await scan(new URL("../app", import.meta.url).pathname);
await scan(new URL("../lib", import.meta.url).pathname);
const manifest = JSON.parse(await readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"));
assert.equal(manifest.d1, null);
assert.equal(manifest.r2, null);
console.log("boundary validation passed: no cross-product or execution interfaces; production bindings disabled");
