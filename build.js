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
  logOverride: {
    "empty-import-meta": "silent"
  },
  platform: "node",
  target: ["node14"]
});

const cjsFiles = await fg("cjs/**/*.js", {
  onlyFiles: true
});

await Promise.all(
  cjsFiles.map(async file => {
    const contents = await fs.readFile(file, "utf8");
    const normalizedContents = contents
      .replace(/((?:\.{1,2}\/)[^"'`]+?)\.js(?=["'`])/g, "$1.cjs")
      .replaceAll(
        "(0, import_url.fileURLToPath)(import_meta.url)",
        "__filename"
      )
      .replaceAll("(0, import_url.fileURLToPath)(__filename)", "__filename")
      .replaceAll("fileURLToPath(__filename)", "__filename")
      .replaceAll("fileURLToPath(import_meta.url)", "__filename")
      .replaceAll("import_meta.url", "__filename");
    const targetFile = file.replace(/\.js$/, ".cjs");

    await fs.writeFile(file, normalizedContents);
    await fs.move(file, targetFile, { overwrite: true });
  })
);
