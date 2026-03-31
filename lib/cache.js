import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { name } = require("../package.json");

const cacheDir = path.join(process.cwd(), "node_modules/.cache", name);
const file = path.join(cacheDir, "i18n-usage.json");

let cachedMap = null;

function ensureCacheDir() {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
}

export function loadI18nUsageMap() {
  if (cachedMap) return cachedMap;

  if (!fs.existsSync(file)) {
    cachedMap = null;
    return null;
  }

  try {
    cachedMap = JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch (error) {
    console.error("Error parsing i18n usage JSON:", error);
    cachedMap = null;
  }

  return cachedMap;
}

export function setI18nUsage(filePath, flag) {
  let map = loadI18nUsageMap();
  if (!map) {
    map = {};
  }
  map[filePath] = flag;
  cachedMap = map;
}

export function saveI18nUsageMap() {
  if (!cachedMap) return;
  ensureCacheDir();
  fs.writeFileSync(file, JSON.stringify(cachedMap, null, 2));
}

export function hasI18nUsage(filePath) {
  const map = loadI18nUsageMap();
  return map?.[filePath] ?? true;
}

export function clearI18nUsageMap() {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
  cachedMap = null;
}
