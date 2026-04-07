import { transformAsync } from "@babel/core";
import { createI18nImportPlugin } from "./visitors.js";
import { hasI18nUsage } from "./cache.js";
import { createFilterFn } from "./utils.js";
import { defaultOptions } from "./options.js";

export function vitePluginImportI18n(userConfig = {}) {
  let filter;
  let resolvedConfig = {};
  let resolvedOptions = userConfig;

  return {
    name: "vite-plugin-extract-i18n-import",
    enforce: "post",
    async configResolved(config) {
      resolvedConfig = config;

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

      const enableSourceMap =
        resolvedConfig.command === "serve"
          ? true
          : !!resolvedConfig.build?.sourcemap;

      const result = await transformAsync(code, {
        filename: path,
        babelrc: false,
        configFile: false,
        sourceMaps: enableSourceMap,
        inputSourceMap: resolvedOptions.enableCombinedSourcemap
          ? this.getCombinedSourcemap()
          : undefined,
        plugins: [createI18nImportPlugin(resolvedOptions)]
      });

      if (!result) return;

      return {
        code: result.code,
        map: enableSourceMap ? result.map : null
      };
    }
  };
}
