import { build } from "esbuild";
import fg from "fast-glob";
import fs from "fs-extra";

const entryPoints = await fg("lib/**/*.js", {
  onlyFiles: true
});

await fs.remove("cjs");
await fs.ensureDir("cjs");

await build({
  entryPoints,
  outdir: "cjs",
  outbase: "lib",
  bundle: false,
  format: "cjs",
  outExtension: {
    ".js": ".cjs"
  },
  logOverride: {
    "empty-import-meta": "silent"
  },
  platform: "node",
  target: ["node14"]
});

const cjsFiles = await fg("cjs/**/*.cjs", {
  onlyFiles: true
});

await Promise.all(
  cjsFiles.map(async file => {
    const contents = await fs.readFile(file, "utf8");
    const normalizedContents = contents
      .replace(/((?:\.{1,2}\/)[^"'`]+?)\.js(?=["'`])/g, "$1.cjs")
      .replaceAll(
        "(0, import_node_url.fileURLToPath)(import_meta.url)",
        "__filename"
      )
      .replaceAll(
        "(0, import_node_url.fileURLToPath)(__filename)",
        "__filename"
      )
      .replaceAll("fileURLToPath(__filename)", "__filename")
      .replaceAll("fileURLToPath(import_meta.url)", "__filename")
      .replaceAll("import_meta.url", "__filename")
      .replaceAll("const import_meta = {};", "")
      .replaceAll('\nvar import_node_url = require("node:url");', "");

    await fs.writeFile(file, normalizedContents);
  })
);
