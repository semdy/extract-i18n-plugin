import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { bin } = require("../package.json");

export function loadConfigSync(file) {
  const resolved = require.resolve(file);
  try {
    const mod = require(resolved);
    return mod.default ?? mod ?? {};
  } catch (err) {
    let unregister = null;
    if (!globalThis.__esbuildRegister__) {
      ({ unregister } = require("esbuild-register/dist/node").register());
      globalThis.__esbuildRegister__ = true;
    }

    delete require.cache[resolved];

    const mod = require(resolved);
    const config = mod.default ?? mod;

    unregister?.();

    return config ?? {};
  }
}

export function loadConfigFileSync() {
  const cwd = process.cwd();
  const fileName = `${Object.keys(bin)[0]}.config`;
  const configFiles = ["ts", "js", "mjs", "cjs", "mts", "cts"].map(
    ext => `${fileName}.${ext}`
  );

  const configPath = configFiles
    .map(name => path.resolve(cwd, name))
    .find(fs.existsSync);

  if (!configPath) {
    console.log(
      `⚠️ [loadConfigFileSync] Can not found any config file, using default options`
    );
    return {};
  }

  return loadConfigSync(configPath);
}

export async function loadConfig() {
  const { loadConfig } = await import("c12");

  const { config } = await loadConfig({
    name: Object.keys(bin)[0],
    defaults: {},
    import: loadConfigSync
  });

  return config;
}
