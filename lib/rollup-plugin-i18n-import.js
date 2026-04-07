import { transformAsync } from "@babel/core";
import { createI18nImportPlugin } from "./visitors.js";
import { hasI18nUsage } from "./cache.js";
import { createFilterFn } from "./utils.js";
import { loadConfigFileByC12 } from "./loadConfigFile.js";
import { defaultOptions } from "./options.js";

export function rollupPluginImportI18n(userConfig = {}) {
  let filter;
  let resolvedOptions = userConfig;

  return {
    name: "rollup-plugin-extract-i18n-import",
    async buildStart() {
      const configFromFile = await loadConfigFileByC12();
      resolvedOptions = { ...defaultOptions, ...configFromFile, ...userConfig };
      filter = createFilterFn(resolvedOptions);
    },
    async transform(code, id) {
      if (!resolvedOptions.enabled || !resolvedOptions.autoImportI18n) {
        return;
      }

      const [path, query] = id.split("?");

      if (
        query?.includes("type=style") ||
        !filter?.(path) ||
        !hasI18nUsage(path)
      ) {
        return;
      }

      const result = await transformAsync(code, {
        filename: path,
        babelrc: false,
        configFile: false,
        sourceMaps: true,
        plugins: [createI18nImportPlugin(resolvedOptions)]
      });

      if (!result) return;

      return {
        code: result.code,
        map: result.map || null
      };
    }
  };
}
