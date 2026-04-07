import { transformAsync } from "@babel/core";
import { createI18nPlugin } from "./visitors.js";
import { hasI18nUsage } from "./cache.js";
import { createFilterFn } from "./utils.js";
import { globalI18nMap } from "./core/index.js";
import { loadConfigFileByC12 } from "./loadConfigFile.js";
import { defaultOptions } from "./options.js";

export function rollupPluginI18n(userConfig = {}) {
  let filter;
  let resolvedOptions = userConfig;

  return {
    name: "rollup-plugin-extract-i18n",
    async buildStart() {
      const configFromFile = await loadConfigFileByC12();
      resolvedOptions = { ...defaultOptions, ...configFromFile, ...userConfig };
      filter = createFilterFn(resolvedOptions);
    },
    async transform(code, id) {
      if (!resolvedOptions.enabled) return;

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
        plugins: [createI18nPlugin(resolvedOptions, globalI18nMap)]
      });

      if (!result) return;

      return {
        code: result.code,
        map: result.map || null
      };
    }
  };
}

/*
import { rollupPluginI18n } from 'extract-i18n-plugin'

export default {
    plugins: [
        rollupPluginI18n()
    ]
}
*/
