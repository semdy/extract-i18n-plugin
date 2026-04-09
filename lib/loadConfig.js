import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

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
    globalThis.__esbuildRegister__ = false;

    return config ?? {};
  }
}

export function loadConfigFileSync() {
  const cwd = process.cwd();
  const fileName = `${Object.keys(bin)[0]}.config`;
  const maybeConfigFiles = ["ts", "js", "mjs", "cjs", "mts", "cts", "json"].map(
    ext => path.resolve(cwd, `${fileName}.${ext}`)
  );
  const configFile = maybeConfigFiles.find(fs.existsSync);

  if (!configFile) {
    console.log(
      `⚠️ [loadConfigFileSync] Can not found any config file, using default options`
    );
    return {};
  }

  return loadConfigSync(configFile);
}

let importCounter = 0;

export async function loadConfig() {
  const { loadConfig } = await import("c12");

  const { config } = await loadConfig({
    name: Object.keys(bin)[0],
    defaults: {},
    import: async configFile => {
      try {
        const configFileURL = pathToFileURL(configFile);
        configFileURL.search = `_${++importCounter}`;
        return await import(configFileURL.href);
      } catch (err) {
        return loadConfigSync(configFile);
      }
    }
  });

  return config;
}
