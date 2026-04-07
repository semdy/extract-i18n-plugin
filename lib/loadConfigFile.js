import fs from "node:fs";
import { createRequire } from "node:module";
import { transformSync } from "esbuild";

const require = createRequire(import.meta.url);
const { bin } = require("../package.json");

export function loadConfigFile(file) {
  if (!file.endsWith(".ts")) {
    return require(file);
  }

  const code = fs.readFileSync(file, "utf-8");

  const { code: js } = transformSync(code, {
    loader: "ts",
    format: "cjs",
    target: "node18"
  });

  const module = { exports: {} };
  const fn = new Function("require", "module", "exports", js);

  fn(require, module, module.exports);

  return module.exports.default ?? module.exports;
}

export async function loadConfigFileByC12() {
  const { loadConfig } = await import("c12");

  const { config } = await loadConfig({
    name: Object.keys(bin)[0],
    defaults: {},
    import: loadConfigFile
  });

  return config;
}
